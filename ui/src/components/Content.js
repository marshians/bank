import React from "react";

import Account from "./Account.js";
import Admin from "./Admin.js";
import { useKeycloak } from "@react-keycloak/web";

let Content = () => {
  const admins = process.env.REACT_APP_ADMINS.split(",");
  const { keycloak } = useKeycloak();

  if (!keycloak.authenticated) {
    return (
      <div>Please login using the button at the top right of this page.</div>
    );
  } else if (admins.includes(keycloak.subject)) {
    return <Admin />;
  } else {
    return <Account />;
  }
};

export default Content;
