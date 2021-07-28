import React from "react";

import { Header } from "semantic-ui-react";

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
      <Header size="huge" textAlign="center">
        {account._id}
      </Header>
      <Header
        size="huge"
        color={account.balance >= 0 ? "green" : "red"}
        textAlign="center"
      >
        {formatter.format(account.balance / 100)}
      </Header>
      <TransactionList />
    </div>
  );
};

export default Account;
