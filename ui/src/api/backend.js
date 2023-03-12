const backend = (token) => {
  const host = window.location.protocol + "//" + window.location.host;
  return {
    get_accounts: async (setter) => {
      let response = await fetch(`${host}/api/accounts`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      let accounts = await response.json();
      setter(accounts);
    },

    get_account: async (setter) => {
      let response = await fetch(`${host}/api/accounts/mine`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      let account = await response.json();
      setter(account);
    },

    get_recent_transactions: async (setter) => {
      let response = await fetch(`${host}/api/transactions`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      let transactions = await response.json();
      setter(transactions);
    },

    new_account: async (account) => {
      await fetch(`${host}/api/accounts`, {
        method: "POST",
        body: JSON.stringify({ _id: account }),
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    },

    new_transaction: async (account, description, amount) => {
      await fetch(`${host}/api/transactions`, {
        method: "POST",
        body: JSON.stringify({
          account_id: account,
          description: description,
          pennies: parseInt(amount.replace(".", ""), 10),
        }),
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    },
  };
};

export default backend;
