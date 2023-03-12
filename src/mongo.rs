use futures::stream::TryStreamExt;

use std::error;
use std::fmt;

use bson::{bson, doc, oid::ObjectId, DateTime};
use mongodb::{options::FindOptions, Client, Database};
use serde::{Deserialize, Serialize};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    Database(mongodb::error::Error),
    AccountNotFound,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::Database(ref e) => write!(f, "database error: {}", e),
            Error::AccountNotFound => write!(f, "account not found"),
        }
    }
}

impl error::Error for Error {
    fn source(&self) -> Option<&(dyn error::Error + 'static)> {
        match *self {
            Error::Database(ref e) => Some(e),
            Error::AccountNotFound => None,
        }
    }
}

impl From<mongodb::error::Error> for Error {
    fn from(err: mongodb::error::Error) -> Error {
        Error::Database(err)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Transaction {
    #[serde(rename = "_id", default)]
    id: ObjectId,
    pub account_id: String,
    #[serde(default = "DateTime::now")]
    when: DateTime,
    pub description: String,
    pub pennies: i64,
    #[serde(default)]
    balance: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Account {
    #[serde(rename = "_id")]
    pub id: String,
    #[serde(default)]
    pub balance: i64,
}

impl From<Account> for bson::Bson {
    fn from(account: Account) -> bson::Bson {
        bson! ({"_id": account.id})
    }
}

pub struct Bank {
    db: Database,
}

impl Bank {
    pub async fn new(uri: &str, db: &str) -> Result<Self> {
        let client = Client::with_uri_str(uri).await?;

        Ok(Self {
            db: client.database(db),
        })
    }

    pub async fn new_account(&mut self, account: &str) -> Result<()> {
        Ok(self
            .db
            .collection::<Account>("accounts")
            .insert_one(
                Account {
                    id: account.to_string(),
                    balance: 0,
                },
                None,
            )
            .await
            .map(|_| ())?)
    }

    pub async fn get_account(&mut self, account: &str) -> Result<Account> {
        self.db
            .collection::<Account>("accounts")
            .find_one(doc! {"_id": account}, None)
            .await?
            .ok_or(Error::AccountNotFound)
    }

    pub async fn get_accounts(&mut self) -> Result<Vec<Account>> {
        let opts = FindOptions::builder().sort(doc! {"_id": 1}).build();

        let mut cursor = self
            .db
            .collection::<Account>("accounts")
            .find(doc! {}, opts)
            .await?;

        let mut v = vec![];
        while let Some(doc) = cursor.try_next().await? {
            v.push(doc);
        }
        Ok(v)
    }

    pub async fn get_recent_transactions(&mut self, account: &str) -> Result<Vec<Transaction>> {
        let opts = FindOptions::builder()
            .limit(50)
            .sort(doc! {"when": -1})
            .build();

        let mut cursor = self
            .db
            .collection::<Transaction>("transactions")
            .find(doc! {"account_id": account}, opts)
            .await?;

        let mut v = vec![];
        while let Some(doc) = cursor.try_next().await? {
            v.push(doc);
        }
        Ok(v)
    }

    pub async fn put_transaction(
        &mut self,
        account: &str,
        description: &str,
        pennies: i64,
    ) -> Result<Account> {
        let accounts = self.db.collection::<Account>("accounts");

        // Get the account
        let mut account = accounts
            .find_one(doc! {"_id": account}, None)
            .await?
            .ok_or(Error::AccountNotFound)?;

        // Update account and save it.
        account.balance += pennies;
        accounts
            .replace_one(doc! {"_id": account.clone().id}, account.clone(), None)
            .await?;

        // Add the transaction to the history.
        let t = Transaction {
            id: ObjectId::new(),
            account_id: account.clone().id,
            when: DateTime::now(),
            description: description.to_string(),
            pennies,
            balance: account.clone().balance,
        };
        Ok(self
            .db
            .collection::<Transaction>("transactions")
            .insert_one(&t, None)
            .await
            .map(|_| account)?)
    }
}

#[cfg(test)]
mod tests {

    #[test]
    fn it_works() {
        let x = 4;
        assert_eq!(2 + 2, x);
    }
}
