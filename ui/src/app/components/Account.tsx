import React, { useEffect, useState } from "react";
import TransactionList from "./TransactionList";
import api from "../api";

type AccountType = {
  _id: string;
  balance: number;
};

const Account: React.FC = () => {
  const [account, setAccount] = useState<AccountType | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await api.getAccount();
        setAccount(data);
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    };

    fetchAccount();
  }, []);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (!account) {
    return <div>Loading account...</div>;
  }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{account._id}</h1>
      <h2 style={{ textAlign: "center" }} className={account.balance >= 0 ? "text-success" : "text-danger"}>
        {formatter.format(account.balance / 100)}
      </h2>
      <TransactionList />
    </div>
  );
};

export default Account;
