import { useEffect, useState } from 'react';
import api, { type Account, type Transaction } from '../api';
import { formatCurrency, formatDate } from '../utils';
import LoadingSpinner from './LoadingSpinner';

interface AccountDetailsProps {
  account: Account;
  onClose: () => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ account, onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await api.getAccountTransactions(account._id);
        setTransactions(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="card bg-surface0 border-surface2 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-surface2">
            <div>
              <h3 className="text-xl font-semibold text-text">{account._id}</h3>
              <div className="text-sm text-subtext1">Account Details</div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface1 transition-colors text-subtext1 hover:text-text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Account Summary */}
          <div className="pt-4 pb-6">
            <div className="text-center">
              <div className="text-sm text-subtext1 mb-1">Current Balance</div>
              <div className={`text-3xl font-bold ${account.balance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(account.balance)}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="border-t border-surface2 pt-4">
            <h4 className="text-lg font-semibold text-text mb-4">Recent Transactions</h4>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <LoadingSpinner message="Loading transactions..." />
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red text-lg font-semibold mb-2">Error</div>
                  <div className="text-subtext1">{error}</div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-subtext1">No transactions found</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="table-header border-b border-surface2">
                        <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
                        <th className="text-left px-4 py-3 text-sm font-medium">Description</th>
                        <th className="text-right px-4 py-3 text-sm font-medium">Amount</th>
                        <th className="text-right px-4 py-3 text-sm font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface2">
                      {transactions.map((transaction) => (
                        <tr key={transaction._id.$oid} className="hover:bg-surface1/50 transition-colors">
                          <td className="px-4 py-3 text-sm text-subtext1">
                            {formatDate(transaction.when.$date.$numberLong)}
                          </td>
                          <td className="px-4 py-3 text-sm text-text">
                            {transaction.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className={transaction.pennies >= 0 ? 'positive' : 'negative'}>
                              {formatCurrency(transaction.pennies)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className={transaction.balance >= 0 ? 'positive' : 'negative'}>
                              {formatCurrency(transaction.balance)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
