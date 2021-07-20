import React from "react";

import { Header, Button, Dropdown, Form } from "semantic-ui-react";

import backend from "../api/backend.js";
import { AuthContext } from "./Auth.js";

let NewTransaction = ({ accounts, updateAccounts }) => {
  const accountList = accounts.map((account) => ({
    key: account._id,
    value: account._id,
    text: account._id,
  }));

  // Our form values.
  const [account, setAccount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const user = React.useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ account, description, amount });
    backend.new_transaction(user, account, description, amount).then(() => {
      updateAccounts();
    });
    setAccount("");
    setDescription("");
    setAmount("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Header size="huge">Add Transaction</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Account</label>
          <Dropdown
            id="account"
            placeholder="Account"
            fluid
            selection
            value={account}
            onChange={(e, { value }) => setAccount(value)}
            options={accountList}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <input
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Amount</label>
          <input
            id="amount"
            pattern="^[-]*\d+(?:\.\d{0,2})$"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Field>
        <Button type="submit" color="blue">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default NewTransaction;
