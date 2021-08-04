import React from "react";

import { GoogleLogin, GoogleLogout } from "react-google-login";

const AuthContext = React.createContext(null);

const Auth = ({ onUserUpdate }) => {
  let client_id = process.env.REACT_APP_CLIENT_ID;
  let [user, setUser] = React.useState(null);

  let failure = (e) => {
    // TODO message user?
    console.log(e);
  };

  let login = (googleUser) => {
    setUser(googleUser);
    onUserUpdate(googleUser);
  };

  let logout = () => {
    console.log("logout");
    setUser(null);
    onUserUpdate(null);
  };

  if (user !== null) {
    return (
      <GoogleLogout
        clientId={client_id}
        render={(renderProps) => (
          <button
            className="btn btn-primary"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            title="logout"
          >
            <img
              style={{ height: "2rem" }}
              alt="logout"
              src={user.getBasicProfile().getImageUrl()}
              size="mini"
            />
          </button>
        )}
        onLogoutSuccess={logout}
      ></GoogleLogout>
    );
  } else {
    return (
      <div>
        <GoogleLogin
          clientId={client_id}
          buttonText="Login"
          onSuccess={login}
          onFailure={failure}
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    );
  }
};

export { Auth, AuthContext };
