use futures::lock::Mutex;

use bank;

#[macro_use]
extern crate rocket;
use rocket::{fs::FileServer, http::Status, response::status, serde::json::Json, State};

#[post("/accounts", data = "<account>")]
async fn new_account(
    b: &State<Mutex<bank::Bank>>,
    account: Json<bank::Account>,
    claims: bank::google::Claims,
) -> Result<Json<bank::Account>, status::Custom<String>> {
    // Verify token.
    if claims.sub != "104096140423971754088".to_string() {
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
    b: &State<Mutex<bank::Bank>>,
    transaction: Json<bank::Transaction>,
    claims: bank::google::Claims,
) -> Result<Json<bank::Account>, status::Custom<String>> {
    // Verify token.
    if claims.sub != "104096140423971754088".to_string() {
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
    b: &State<Mutex<bank::Bank>>,
    claims: bank::google::Claims,
) -> Result<Json<Vec<bank::Transaction>>, status::Custom<String>> {
    let mut b = b.lock().await;
    match b.get_recent_transactions(&claims.email).await {
        Ok(txns) => Ok(Json(txns)),
        Err(err) => Err(status::Custom(Status::InternalServerError, err.to_string())),
    }
}

#[get("/accounts/mine")]
async fn get_account_mine(
    b: &State<Mutex<bank::Bank>>,
    claims: bank::google::Claims,
) -> Result<Json<bank::Account>, status::Custom<String>> {
    let mut b = b.lock().await;
    match b.get_account(&claims.email).await {
        Ok(account) => Ok(Json(account)),
        Err(err) => Err(status::Custom(Status::InternalServerError, err.to_string())),
    }
}

#[get("/accounts")]
async fn get_accounts(
    b: &State<Mutex<bank::Bank>>,
    claims: bank::google::Claims,
) -> Result<Json<Vec<bank::Account>>, status::Custom<String>> {
    // Verify token.
    if claims.sub != "104096140423971754088".to_string() {
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
    let b = bank::Bank::new(
        &std::env::var("MONGO_URI").unwrap(),
        &std::env::var("MONGO_DB").unwrap(),
    )
    .await
    .unwrap();

    rocket::build()
        .manage(Mutex::new(b))
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
