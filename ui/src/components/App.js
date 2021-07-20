import React from "react";

import { Container, Menu } from "semantic-ui-react";

import { AuthContext, Auth } from "./Auth.js";
import Content from "./Content.js";

let App = () => {
  let [user, setUser] = React.useState(null);

  return (
    <AuthContext.Provider value={user}>
      <Menu inverted attached style={{ backgroundColor: "#2d2a2e" }}>
        <Menu.Item>
          <img src="/images/safari-pinned-tab.svg" alt="marshian alien" />
        </Menu.Item>
        <Menu.Item>Marshian's Bank</Menu.Item>
        <Menu.Item position="right">
          <Auth onUserUpdate={setUser} />
        </Menu.Item>
      </Menu>
      <Container>
        <Content></Content>
      </Container>
    </AuthContext.Provider>
  );
};

export default App;
