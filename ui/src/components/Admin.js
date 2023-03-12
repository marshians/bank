import React from "react";

import NewAccount from "./NewAccount.js";
import AccountList from "./AccountList.js";
import NewTransaction from "./NewTransaction.js";

import backend from "./../api/backend.js";
import { useKeycloak } from "@react-keycloak/web";

let Admin = () => {
  const { keycloak } = useKeycloak();
  const [accounts, setAccounts] = React.useState([]);
  const updateAccounts = React.useCallback(() => {
    backend(keycloak.token).get_accounts(setAccounts);
  }, []);

  React.useEffect(() => {
    updateAccounts();
  }, [updateAccounts]);

  return (
    <div>
      <AccountList accounts={accounts} updateAccounts={updateAccounts} />
      <NewTransaction accounts={accounts} updateAccounts={updateAccounts} />
      <NewAccount accounts={accounts} updateAccounts={updateAccounts} />
    </div>
  );
};

export default Admin;
