import React from "react";
import api from '../api';

type NewAccountProps = {
  updateAccounts: () => void;
};

const NewAccount: React.FC<NewAccountProps> = ({ updateAccounts }) => {
  // Our form values.
  const [account, setAccount] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      await api.createAccount(account);
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