use std::error;
use std::fmt;

use crate::options::Options;

use hyper::{Body, Client, Method, Request, Uri};
use hyper_rustls::HttpsConnector;
use jsonwebtoken;
use lazy_static::lazy_static;
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome};
use serde::{Deserialize, Serialize};
use serde_json::from_slice;

lazy_static! {
    pub static ref GOOGLE_CERTS_URL: &'static str = "https://www.googleapis.com/oauth2/v3/certs";
    pub static ref CLIENT: Client<HttpsConnector<hyper::client::connect::HttpConnector>, hyper::body::Body> = {
        let https = HttpsConnector::with_webpki_roots();
        Client::builder().build::<_, hyper::Body>(https)
    };
}

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    JWT(jsonwebtoken::errors::Error),
    BadRequest(String),
    HTTP(String),
    Decode(serde_json::Error),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::JWT(ref e) => write!(f, "JWT: {}", e),
            Error::BadRequest(ref e) => write!(f, "bad request: {}", e),
            Error::HTTP(ref e) => write!(f, "http error: {}", e),
            Error::Decode(ref e) => write!(f, "decoding error: {}", e),
        }
    }
}

impl error::Error for Error {
    fn source(&self) -> Option<&(dyn error::Error + 'static)> {
        match *self {
            Error::BadRequest(_) => None,
            Error::HTTP(_) => None,
            Error::Decode(ref e) => Some(e),
            Error::JWT(ref e) => Some(e),
        }
    }
}

impl From<http::uri::InvalidUri> for Error {
    fn from(err: http::uri::InvalidUri) -> Error {
        Error::HTTP(err.to_string())
    }
}

impl From<http::Error> for Error {
    fn from(err: http::Error) -> Error {
        Error::HTTP(err.to_string())
    }
}
impl From<hyper::Error> for Error {
    fn from(err: hyper::Error) -> Error {
        Error::HTTP(err.to_string())
    }
}

impl From<serde_json::Error> for Error {
    fn from(err: serde_json::Error) -> Error {
        Error::Decode(err)
    }
}

impl From<std::str::Utf8Error> for Error {
    fn from(err: std::str::Utf8Error) -> Error {
        Error::HTTP(err.to_string())
    }
}

impl From<jsonwebtoken::errors::Error> for Error {
    fn from(err: jsonwebtoken::errors::Error) -> Error {
        Error::HTTP(err.to_string())
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct KeySet {
    keys: Vec<Key>,
}

impl KeySet {
    fn get(&self, kid: String) -> Option<Key> {
        for k in self.keys.iter() {
            if k.kid == kid {
                return Some(k.clone());
            }
        }
        return None;
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Key {
    e: String,
    n: String,
    kid: String,
    kty: String,
    alg: String,

    #[serde(rename = "use")]
    us: String,
}

async fn get_google_keys() -> Result<KeySet> {
    let request = Request::builder()
        .method(Method::GET)
        .uri(GOOGLE_CERTS_URL.parse::<Uri>()?)
        .body(Body::empty())?;

    let res = CLIENT.request(request).await?;
    let status = res.status();
    let body = hyper::body::to_bytes(res).await?;

    if !status.is_success() {
        let body = std::str::from_utf8(&body)?;
        return Err(Error::HTTP(format!(
            "non-success response: {} {}",
            status, body
        )));
    }

    Ok(from_slice::<KeySet>(&body)?)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub name: String,
    pub email: String,
    pub picture: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Claims {
    type Error = Error;

    async fn from_request(req: &'r rocket::request::Request<'_>) -> Outcome<Self, Self::Error> {
        if let Some(token) = req.headers().get_one("authorization") {
            // make sure fist part is bearer
            let parts = token.split(" ").collect::<Vec<&str>>();
            if parts.len() != 2 || parts[0].to_lowercase() != "bearer" {
                return Outcome::Failure((
                    Status::Unauthorized,
                    Error::BadRequest("invalid authorization header".to_string()),
                ));
            }

            // Verify JWT.
            let options = req.rocket().state::<Options>().unwrap();
            match verify_token(parts[1], &options.client_id).await {
                Ok(claims) => Outcome::Success(claims),
                Err(e) => {
                    return Outcome::Failure((
                        Status::Unauthorized,
                        Error::BadRequest("invalid token".to_string()),
                    ));
                }
            }
        } else {
            Outcome::Failure((
                Status::Unauthorized,
                Error::BadRequest("no authorization header".to_string()),
            ))
        }
    }
}

async fn verify_token(token: &str, aud: &str) -> Result<Claims> {
    // Get google's keys.
    let keys = get_google_keys().await?;

    let header = jsonwebtoken::decode_header(token)?;
    let kid = header
        .kid
        .ok_or(Error::BadRequest("no kid in token".to_string()))?;

    let key = keys
        .get(kid)
        .ok_or(Error::BadRequest("no key found for kid".to_string()))?;

    // Decode with RS256 using Google's keys and our audience.
    let dk = jsonwebtoken::DecodingKey::from_rsa_components(key.n.as_str(), key.e.as_str())?;
    let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
    validation.set_audience(&[aud]);

    Ok(jsonwebtoken::decode::<Claims>(&token, &dk, &validation)?.claims)
}
