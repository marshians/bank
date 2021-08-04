import React from "react";

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
    <div style={{ marginTop: "1em" }}>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            id="name"
            className="form-control"
            placeholder="name"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewAccount;
