use clap::Parser;

/// Marshian's Banking App.
#[derive(Parser, Debug)]
#[clap(name = "Bank")]
pub struct Options {
    /// The MongoDB URI to use for the bank database.
    #[clap(
        short,
        long,
        env = "MONGO_URI",
        default_value = "mongodb://localhost:27017"
    )]
    pub uri: String,

    /// The database name to us for the bank database.
    #[clap(short, long, env = "MONGO_DB", default_value = "bank")]
    pub db: String,

    /// The URL to obtain keys for verifying the JWT.
    #[clap(long, env = "JWKS_URI", default_value = "")]
    pub jwks_uri: String,

    /// How often to request the jwks keys in seconds
    #[clap(long, env = "JWKS_RENEW", default_value = "3600")]
    pub jwks_renew: usize,

    /// The issuer to verify in the JWT.
    #[clap(short, long, env = "ISSUER", default_value = "")]
    pub issuer: String,

    /// The list of administrative users
    #[clap(short, long, env = "ADMINS", value_delimiter = ',', default_value = "")]
    pub admins: Vec<String>,
}
