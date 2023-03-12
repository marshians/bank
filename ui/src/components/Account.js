import React from "react";

import TransactionList from "./TransactionList.js";

import backend from "./../api/backend.js";
import { useKeycloak } from "@react-keycloak/web";

const Account = () => {
  const { keycloak } = useKeycloak();

  const [account, setAccount] = React.useState({ _id: "none", balance: 0 });
  React.useEffect(() => {
    backend(keycloak.token).get_account(setAccount);
  }, [keycloak, setAccount]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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
