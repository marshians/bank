import React from "react";

import { Header, Button, Form } from "semantic-ui-react";

import { AuthContext } from "./Auth.js";

import backend from "../api/backend.js";

let NewAccount = ({ updateAccounts }) => {
  // Our form values.
  const [account, setAccount] = React.useState("");

  const user = React.useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      await backend(user).new_account(account);
      updateAccounts();
    })();
    setAccount("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Header size="huge">Create Account</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Name</label>
          <input
            id="name"
            placeholder="name"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </Form.Field>
        <Button type="submit" color="blue">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default NewAccount;
