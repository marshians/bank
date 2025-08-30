import { useEffect, useState } from 'react';
import api, { type Account as AccountType } from '../api';
import { formatCurrency } from '../utils';
import LoadingSpinner from './LoadingSpinner';
import TransactionList from './TransactionList';

const Account: React.FC = () => {
  const [account, setAccount] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const data = await api.getAccount();
        setAccount(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching account:', error);
        setError('Failed to load account information');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your account..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red text-lg font-semibold mb-2">Error</div>
        <div className="text-subtext1">{error}</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <div className="text-subtext1">No account found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Account Summary Card */}
      <div className="card text-center">
        <h1 className="text-3xl font-bold text-text mb-2">{account._id}</h1>
        <div className="text-5xl font-bold mb-4">
          <span className={account.balance >= 0 ? 'positive' : 'negative'}>
            {formatCurrency(account.balance)}
          </span>
        </div>
        <div className="text-subtext1">Current Balance</div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-text mb-6 text-center">
          Recent Transactions
        </h2>
        <TransactionList />
      </div>
    </div>
  );
};

export default Account;
