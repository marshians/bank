import React from "react";

import { useKeycloak } from "@react-keycloak/web";

const Auth = () => {
  const { keycloak } = useKeycloak();

  return (
    <div>
      {!keycloak.authenticated && (
        <button
          type="button"
          className="btn btb-primary"
          onClick={() => keycloak.login()}
        >
          Login
        </button>
      )}

      {!!keycloak.authenticated && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => keycloak.logout()}
        >
          Logout ({keycloak.tokenParsed.preferred_username})
        </button>
      )}
    </div>
  );
};

export { Auth };
