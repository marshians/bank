const backend = (user) => {
  const host = window.location.protocol + "//" + window.location.host;
  return {
    get_accounts: async (setter) => {
      if (user === null || user === undefined) return;
      let response = await fetch(`${host}/api/accounts`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      });
      let accounts = await response.json();
      setter(accounts);
    },

    get_account: async (setter) => {
      if (user === null || user === undefined) return;
      let response = await fetch(`${host}/api/accounts/mine`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      });
      let account = await response.json();
      setter(account);
    },

    get_recent_transactions: async (setter) => {
      if (user === null || user === undefined) return;
      let response = await fetch(`${host}/api/transactions`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      });
      let transactions = await response.json();
      setter(transactions);
    },

    new_account: async (account) => {
      if (user === null || user === undefined) return;
      await fetch(`${host}/api/accounts`, {
        method: "POST",
        body: JSON.stringify({ _id: account }),
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      });
    },

    new_transaction: async (account, description, amount) => {
      if (user === null || user === undefined) return;
      await fetch(`${host}/api/transactions`, {
        method: "POST",
        body: JSON.stringify({
          account_id: account,
          description: description,
          pennies: parseInt(amount.replace(".", ""), 10),
        }),
        headers: {
          Authorization: "Bearer " + user.getAuthResponse().id_token,
        },
      });
    },
  };
};

export default backend;
