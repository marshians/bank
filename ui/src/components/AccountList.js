import React from "react";

import { Header, Table } from "semantic-ui-react";

let AccountList = ({ accounts }) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const rows = accounts.map((account) => (
    <Table.Row key={account._id}>
      <Table.Cell>{account._id}</Table.Cell>
      <Table.Cell
        textAlign="right"
        positive={account.balance >= 0}
        negative={account.balance < 0}
      >
        {formatter.format(account.balance / 100)}
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <div style={{ marginTop: "20px" }}>
      <Header size="huge">Accounts</Header>
      <Table celled color="orange">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Balance</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{rows}</Table.Body>
      </Table>
    </div>
  );
};

export default AccountList;
