import React from "react";

import { GoogleLogin, GoogleLogout } from "react-google-login";

import { Image } from "semantic-ui-react";

const AuthContext = React.createContext(null);

const Auth = ({ onUserUpdate }) => {
  let client_id =
    "716077649050-1ljjukjd46g833cvmja7d5etnc350fte.apps.googleusercontent.com";
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
            style={{
              backgroundColor: "#2d2a2e",
              cursor: "pointer",
              border: "none",
            }}
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            title="logout"
          >
            <Image
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
