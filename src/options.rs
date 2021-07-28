use clap::Clap;

/// Marshian's Banking App.
#[derive(Clap, Debug)]
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

    /// The client id google authenticates with.
    #[clap(short, long, env = "CLIENT_ID", default_value = "")]
    pub client_id: String,

    /// The list of administrative users
    #[clap(short, long, env = "ADMINS", value_delimiter = ",", default_value = "")]
    pub admins: Vec<String>,
}
