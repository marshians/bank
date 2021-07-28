import React from "react";

import { AuthContext } from "./Auth.js";
import NewAccount from "./NewAccount.js";
import AccountList from "./AccountList.js";
import NewTransaction from "./NewTransaction.js";

import backend from "./../api/backend.js";

let Admin = () => {
  const [accounts, setAccounts] = React.useState([]);
  const user = React.useContext(AuthContext);
  const updateAccounts = React.useCallback(() => {
    backend(user).get_accounts(setAccounts);
  }, [user]);

  React.useEffect(() => {
    updateAccounts();
  }, [user, updateAccounts]);

  return (
    <div>
      <AccountList accounts={accounts} updateAccounts={updateAccounts} />
      <NewTransaction accounts={accounts} updateAccounts={updateAccounts} />
      <NewAccount accounts={accounts} updateAccounts={updateAccounts} />
    </div>
  );
};

export default Admin;
