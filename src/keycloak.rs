use std::error;
use std::fmt;

use hyper::{Body, Client, Method, Request, Uri};
use hyper_rustls::HttpsConnector;
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome};
use serde::{Deserialize, Serialize};
use serde_json::from_slice;

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
        None
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

pub struct Config {
    client: Client<HttpsConnector<hyper::client::connect::HttpConnector>, hyper::body::Body>,
    keys: KeySet,
    issuer: String,
    jwks_uri: String,
    last_updated: std::time::Instant,
    renew: u64,
}

impl Config {
    pub async fn new(jwks_uri: String, issuer: String, renew: u64) -> Result<Self> {
        let https = HttpsConnector::with_webpki_roots();
        let client = Client::builder().build::<_, hyper::Body>(https);
        let keys = Config::get_keycloak_keys(&client, &jwks_uri.to_string()).await?;
        Ok(Self {
            client,
            keys,
            issuer,
            jwks_uri,
            last_updated: std::time::Instant::now(),
            renew,
        })
    }

    async fn verify_token(&mut self, token: &str) -> Result<Claims> {
        // Get jwks from uri.
        if self.last_updated.elapsed().as_secs() > self.renew {
            self.keys = Config::get_keycloak_keys(&self.client, &self.jwks_uri.to_string()).await?;
        }

        // Figure out which key to use.
        let header = jsonwebtoken::decode_header(token)?;
        let kid = header
            .kid
            .ok_or_else(|| Error::BadRequest("no kid in token".to_string()))?;
        let key = self
            .keys
            .get(kid)
            .ok_or_else(|| Error::BadRequest("no key found for kid".to_string()))?;

        // Decode with RS256 using keycloak's keys and our issuer.
        let dk = jsonwebtoken::DecodingKey::from_rsa_components(key.n.as_str(), key.e.as_str())?;
        let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
        validation.set_issuer(&[self.issuer.clone()]);
        Ok(jsonwebtoken::decode::<Claims>(token, &dk, &validation)?.claims)
    }

    async fn get_keycloak_keys(
        client: &Client<HttpsConnector<hyper::client::connect::HttpConnector>, hyper::body::Body>,
        jwks_uri: &str,
    ) -> Result<KeySet> {
        let request = Request::builder()
            .method(Method::GET)
            .uri(jwks_uri.parse::<Uri>()?)
            .body(Body::empty())?;

        let res = client.request(request).await?;
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
        Error::JWT(err)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub email: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Claims {
    type Error = Error;

    async fn from_request(req: &'r rocket::request::Request<'_>) -> Outcome<Self, Self::Error> {
        if let Some(token) = req.headers().get_one("authorization") {
            // make sure fist part is bearer
            let parts = token.split(' ').collect::<Vec<&str>>();
            if parts.len() != 2 || parts[0].to_lowercase() != "bearer" {
                return Outcome::Failure((
                    Status::Unauthorized,
                    Error::BadRequest("invalid authorization header".to_string()),
                ));
            }

            // Verify JWT.
            let config = req
                .rocket()
                .state::<futures::lock::Mutex<Config>>()
                .unwrap();
            let mut config = config.lock().await;
            match config.verify_token(parts[1]).await {
                Ok(claims) => Outcome::Success(claims),
                Err(e) => {
                    println!("{e}");
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
