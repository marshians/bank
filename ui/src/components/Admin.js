import React from "react";

import { AuthContext } from "./Auth.js";
import NewAccount from "./NewAccount.js";
import AccountList from "./AccountList.js";
import NewTransaction from "./NewTransaction.js";

import backend from "./../api/backend.js";

let Admin = () => {
  const user = React.useContext(AuthContext);
  const [accounts, setAccounts] = React.useState([]);

  const updateAccounts = React.useCallback(() => {
    if (
      user !== null &&
      user !== undefined &&
      user.getBasicProfile().getId() === "104096140423971754088"
    ) {
      backend.get_accounts(user).then((aa) => {
        setAccounts(aa);
      });
    }
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
