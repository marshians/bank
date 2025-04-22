import React from "react";
import Account from "./Account";
import Admin from "./Admin";

import keycloak from "../../keycloak";

const Content: React.FC = () => {
  const admins = import.meta.env.VITE_ADMINS.split(",");

  if (admins.includes(keycloak.subject || "")) {
    return <Admin />;
  } else {
    return <Account />;
  }
};

export default Content;