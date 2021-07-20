const backend = {
  get_accounts: (user) => {
    return fetch(
      window.location.protocol + "//" + window.location.host + "/api/accounts",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      },
    ).then((d) => d.json());
  },

  get_account: (user) => {
    return fetch(
      window.location.protocol +
        "//" +
        window.location.host +
        "/api/accounts/mine",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      },
    ).then((d) => d.json());
  },

  get_recent_transactions: (user) => {
    return fetch(
      window.location.protocol +
        "//" +
        window.location.host +
        "/api/transactions",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      },
    ).then((d) => d.json());
  },

  new_account: (user, account) => {
    return fetch(
      window.location.protocol + "//" + window.location.host + "/api/accounts",
      {
        method: "POST",
        body: JSON.stringify({ _id: account }),
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      },
    );
  },

  new_transaction: (user, account, description, amount) => {
    return fetch(
      window.location.protocol +
        "//" +
        window.location.host +
        "/api/transactions",
      {
        method: "POST",
        body: JSON.stringify({
          account_id: account,
          description: description,
          pennies: parseInt(amount.replace(".", ""), 10),
        }),
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      },
    );
  },
};

export default backend;
