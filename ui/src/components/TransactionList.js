import { useKeycloak } from "@react-keycloak/web";
import React from "react";

import backend from "./../api/backend.js";

let TransactionList = () => {
  const [transactions, setTransactions] = React.useState([]);

  const { keycloak } = useKeycloak();

  React.useEffect(() => {
    backend(keycloak.token).get_recent_transactions(setTransactions);
  }, [keycloak, setTransactions]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const rows = transactions.map((txn) => {
    const d = new Date(parseInt(txn.when.$date.$numberLong));
    return (
      <tr key={txn._id.$oid}>
        <td>{d.toISOString()}</td>
        <td>{txn.description}</td>
        <td className={txn.pennies >= 0 ? "text-success" : "text-danger"}>
          {formatter.format(txn.pennies / 100)}
        </td>
        <td className={txn.balance >= 0 ? "text-success" : "text-danger"}>
          {formatter.format(txn.balance / 100)}
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h3>Recent Transactions</h3>
      <table className="table table-striped rounded">
        <thead>
          <tr className="table-secondary">
            <th>Date</th>
            <th>Description</th>
            <th className="right">Amount</th>
            <th className="right">Balance</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default TransactionList;
