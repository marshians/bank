import React, { useEffect, useState } from "react";
import api from "../api";

type Transaction = {
  _id: { $oid: string };
  when: { $date: { $numberLong: string } };
  description: string;
  pennies: number;
  balance: number;
};

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await api.getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [setTransactions]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const rows = transactions.map((txn) => {
    const d = new Date(parseInt(txn.when.$date.$numberLong));
    return (
      <tr key={txn._id.$oid}>
        <td className="text-success">{d.toISOString()}</td>
        <td className="text-success">{txn.description}</td>
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
      <h3 style={{ textAlign: "center" }}>Recent Transactions</h3>
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
