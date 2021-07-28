import React from "react";

import { Header, Table } from "semantic-ui-react";

import { AuthContext } from "./Auth.js";
import backend from "./../api/backend.js";

let TransactionList = () => {
  const [transactions, setTransactions] = React.useState([]);

  const user = React.useContext(AuthContext);
  React.useEffect(() => {
    backend(user).get_recent_transactions(setTransactions);
  }, [user, setTransactions]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const rows = transactions.map((txn) => {
    return (
      <Table.Row key={txn._id.$oid}>
        <Table.Cell>{txn.when.$date}</Table.Cell>
        <Table.Cell>{txn.description}</Table.Cell>
        <Table.Cell
          textAlign="right"
          positive={txn.pennies >= 0}
          negative={txn.pennies < 0}
        >
          {formatter.format(txn.pennies / 100)}
        </Table.Cell>
        <Table.Cell
          textAlign="right"
          positive={txn.balance >= 0}
          negative={txn.balance < 0}
        >
          {formatter.format(txn.balance / 100)}
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <div>
      <Header size="huge">Recent Transactions</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Amount</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Balance</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table>
    </div>
  );
};

export default TransactionList;
