use futures::lock::Mutex;

#[macro_use]
extern crate rocket;
use clap::Parser;
use rocket::{fs::FileServer, http::Status, response::status, serde::json::Json, State};

#[post("/accounts", data = "<account>")]
async fn new_account(
    b: &State<Mutex<bank::mongo::Bank>>,
    options: &State<bank::options::Options>,
    account: Json<bank::mongo::Account>,
    claims: bank::keycloak::Claims,
) -> Result<Json<bank::mongo::Account>, status::Custom<String>> {
    // Verify admin.
    if !options.admins.contains(&claims.sub) {
        return Err(status::Custom(
            Status::Unauthorized,
            "not admin".to_string(),
        ));
    }

    let mut b = b.lock().await;
    match b.new_account(&account.id).await {
        Ok(_) => Ok(account),
        Err(err) => Err(status::Custom(Status::InternalServerError, err.to_string())),
    }
}

#[post("/transactions", data = "<transaction>")]
async fn new_transaction(
    b: &State<Mutex<bank::mongo::Bank>>,
    options: &State<bank::options::Options>,
    transaction: Json<bank::mongo::Transaction>,
    claims: bank::keycloak::Claims,
) -> Result<Json<bank::mongo::Account>, status::Custom<String>> {
    // Verify admin.
    if !options.admins.contains(&claims.sub) {
        return Err(status::Custom(
            Status::Unauthorized,
            "not admin".to_string(),
        ));
    }

    let mut b = b.lock().await;
    match b
        .put_transaction(
            &transaction.account_id,
            &transaction.description,
            transaction.pennies,
        )
        .await
    {
        Ok(account) => Ok(Json(account)),
        Err(err) => Err(status::Custom(Status::InternalServerError, err.to_string())),
    }
}

#[get("/transactions")]
async fn get_transactions(
    b: &State<Mutex<bank::mongo::Bank>>,
    claims: bank::keycloak::Claims,
) -> Result<Json<Vec<bank::mongo::Transaction>>, status::Custom<String>> {
    let mut b = b.lock().await;
    match b.get_recent_transactions(&claims.email).await {
        Ok(txns) => Ok(Json(txns)),
        Err(err) => Err(status::Custom(Status::InternalServerError, err.to_string())),
    }
}

#[get("/accounts/mine")]
async fn get_account_mine(
    b: &State<Mutex<bank::mongo::Bank>>,
    claims: bank::keycloak::Claims,
) -> Result<Json<bank::mongo::Account>, status::Custom<String>> {
    let mut b = b.lock().await;
    match b.get_account(&claims.email).await {
        Ok(account) => Ok(Json(account)),
        Err(err) => Err(status::Custom(Status::InternalServerError, err.to_string())),
    }
}

#[get("/accounts")]
async fn get_accounts(
    b: &State<Mutex<bank::mongo::Bank>>,
    options: &State<bank::options::Options>,
    claims: bank::keycloak::Claims,
) -> Result<Json<Vec<bank::mongo::Account>>, status::Custom<String>> {
    // Verify admin.
    if !options.admins.contains(&claims.sub) {
        return Err(status::Custom(
            Status::Unauthorized,
            "not admin".to_string(),
        ));
    }

    let mut b = b.lock().await;
    let accounts = match b.get_accounts().await {
        Ok(accounts) => accounts,
        Err(err) => return Err(status::Custom(Status::InternalServerError, err.to_string())),
    };

    Ok(Json(accounts))
}

#[launch]
async fn rocket() -> _ {
    let options = bank::options::Options::parse();
    let b = bank::mongo::Bank::new(&options.uri, &options.db)
        .await
        .unwrap();
    let c = bank::keycloak::Config::new(
        options.jwks_uri.to_string(),
        options.issuer.to_string(),
        options.jwks_renew as u64,
    )
    .await
    .unwrap();
    rocket::build()
        .manage(Mutex::new(b))
        .manage(Mutex::new(c))
        .manage(options)
        .mount("/", FileServer::from("./ui"))
        .mount(
            "/api",
            routes![
                get_accounts,
                get_account_mine,
                new_account,
                new_transaction,
                get_transactions
            ],
        )
}
