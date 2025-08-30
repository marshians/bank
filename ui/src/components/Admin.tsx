import { useEffect, useState, useCallback } from 'react';
import api, { type Account } from '../api';
import LoadingSpinner from './LoadingSpinner';
import AccountList from './AccountList';
import NewAccount from './NewAccount';
import NewTransaction from './NewTransaction';
import Modal from './Modal';
import AccountDetails from './AccountDetails';

const Admin: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const updateAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAccounts();
      setAccounts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateAccounts();
  }, [updateAccounts]);

  const handleNewAccountSuccess = async () => {
    setShowNewAccountModal(false);
    await updateAccounts();
  };

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
  };

  const handleCloseAccountDetails = () => {
    setSelectedAccount(null);
  };

  if (loading && accounts.length === 0) {
    return <LoadingSpinner message="Loading accounts..." />;
  }

  if (error && accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red text-lg font-semibold mb-2">Error</div>
        <div className="text-subtext1">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Dashboard Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
        <p className="text-subtext1">Manage accounts and transactions</p>
      </div>

      {/* Account Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accounts List */}
        <div className="card">
          <AccountList 
            accounts={accounts} 
            onNewAccount={() => setShowNewAccountModal(true)}
            onAccountClick={handleAccountClick}
          />
        </div>

        {/* New Transaction */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-text mb-6">Add Transaction</h2>
          <NewTransaction accounts={accounts} updateAccounts={updateAccounts} />
        </div>
      </div>

      {/* New Account Modal */}
      <Modal
        isOpen={showNewAccountModal}
        onClose={() => setShowNewAccountModal(false)}
        title="Create New Account"
      >
        <NewAccount updateAccounts={handleNewAccountSuccess} />
      </Modal>

      {/* Account Details Modal */}
      {selectedAccount && (
        <AccountDetails
          account={selectedAccount}
          onClose={handleCloseAccountDetails}
        />
      )}
    </div>
  );
};

export default Admin;
