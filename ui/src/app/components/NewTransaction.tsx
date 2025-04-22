import React from "react";
import api from "../api";

type Account = {
  _id: string;
};

type NewTransactionProps = {
  accounts: Account[];
  updateAccounts: () => void;
};

const NewTransaction: React.FC<NewTransactionProps> = ({
  accounts,
  updateAccounts,
}) => {
  const accountList = [
    <option key="none" value="" disabled hidden>
      select an account
    </option>,
    ...accounts.map((account) => (
      <option key={account._id} value={account._id}>
        {account._id}
      </option>
    )),
  ];

  // Our form values.
  const [account, setAccount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      await api.createTransaction(account, description, amount);
      updateAccounts();
      setAccount("");
      setDescription("");
      setAmount("");
    })();
  };

  return (
    <div style={{ marginTop: "1em" }}>
      <h1>Add Transaction</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Account</label>
          <select
            required
            id="account"
            className="form-select"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            {accountList}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            required
            id="description"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            required
            id="amount"
            className="form-control"
            pattern="^-?\d+(\.\d{2})?$"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTransaction;
