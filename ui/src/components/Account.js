import React from "react";

import TransactionList from "./TransactionList.js";

import { AuthContext } from "./Auth.js";
import backend from "./../api/backend.js";

const Account = () => {
  const [account, setAccount] = React.useState(null);
  const user = React.useContext(AuthContext);
  React.useEffect(() => {
    backend(user).get_account(setAccount);
  }, [user, setAccount]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (account === null) return <div></div>;

  return (
    <div>
      <h1>{account._id}</h1>
      <h2 className={account.balance >= 0 ? "text-success" : "text-danger"}>
        {formatter.format(account.balance / 100)}
      </h2>
      <TransactionList />
    </div>
  );
};

export default Account;
