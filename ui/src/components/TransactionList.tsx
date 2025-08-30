import { useEffect, useState } from 'react';
import api, { type Transaction } from '../api';
import { formatCurrency, formatDate } from '../utils';
import LoadingSpinner from './LoadingSpinner';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await api.getTransactions();
        setTransactions(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red text-lg font-semibold mb-2">Error</div>
        <div className="text-subtext1">{error}</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-subtext1">No transactions found</div>
      </div>
    );
  }

  return (
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
  );
};

export default TransactionList;
