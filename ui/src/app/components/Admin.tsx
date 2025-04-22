import React from "react";
import NewAccount from "./NewAccount";
import AccountList from "./AccountList";
import NewTransaction from "./NewTransaction";
import api from '../api';

type Account = {
  _id: string;
  balance: number;
};

const Admin: React.FC = () => {
  const [accounts, setAccounts] = React.useState<Account[]>([]);

  const updateAccounts = React.useCallback(() => {
    const fetchAccounts = async () => {
      try {
        const data = await api.getAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [setAccounts]);

  React.useEffect(() => {
    updateAccounts();
  }, [updateAccounts]);

  return (
    <div>
      <AccountList accounts={accounts} />
      <NewTransaction accounts={accounts} updateAccounts={updateAccounts} />
      <NewAccount updateAccounts={updateAccounts} />
    </div>
  );
};

export default Admin;