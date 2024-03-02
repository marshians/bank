use clap::{Parser, Subcommand};

/// Marshian's Banking App Controller.
#[derive(Parser, Debug)]
#[command(name = "Bank")]
pub struct Options {
    /// The MongoDB URI to use for the bank database.
    #[arg(
        short,
        long,
        env = "MONGO_URI",
        default_value = "mongodb://localhost:27017"
    )]
    pub uri: String,

    /// The database name to us for the bank database.
    #[arg(short, long, env = "MONGO_DB", default_value = "bank")]
    pub db: String,

    #[command(subcommand)]
    command: Subcommands,
}

#[derive(Debug, Subcommand)]
pub enum Subcommands {
    /// List all accounts and their balances.
    List,

    /// Add money to an account.
    Add {
        /// The amount of pennies to add to the account.
        pennies: i64,

        // The account ID to add money to.
        account: String,

        // The description of the transaction
        description: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let options = Options::parse();
    let mut b = bank::mongo::Bank::new(&options.uri, &options.db)
        .await
        .unwrap();

    match options.command {
        Subcommands::List => {
            for account in b.get_accounts().await.unwrap() {
                println!("{}: {}", account.id, account.balance as f64 / 100.0);
            }
        }
        Subcommands::Add {
            pennies,
            account,
            description,
        } => {
            b.put_transaction(&account, &description, pennies)
                .await
                .unwrap();
        }
    }

    Ok(())
}
