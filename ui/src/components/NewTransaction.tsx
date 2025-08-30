import { useState } from 'react';
import api, { type Account } from '../api';

interface NewTransactionProps {
  accounts: Account[];
  updateAccounts: () => Promise<void>;
}

const NewTransaction: React.FC<NewTransactionProps> = ({ accounts, updateAccounts }) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount || !description.trim() || !amount.trim()) {
      setError('All fields are required');
      return;
    }

    // Validate amount format
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await api.createTransaction(selectedAccount, description.trim(), amount);
      await updateAccounts();
      
      setSelectedAccount('');
      setDescription('');
      setAmount('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to create transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="account" className="block text-sm font-medium text-subtext1 mb-2">
          Account
        </label>
        <select
          id="account"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="input-primary w-full rounded-lg border px-3 py-2 text-sm"
          disabled={loading}
        >
          <option value="">Select an account</option>
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account._id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-subtext1 mb-2">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-primary w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Transaction description"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-subtext1 mb-2">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-primary w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="0.00"
          disabled={loading}
        />
        <div className="text-xs text-subtext0 mt-1">
          Enter positive amounts for deposits, negative for withdrawals
        </div>
      </div>

      {error && (
        <div className="text-red text-sm bg-red/10 border border-red/20 rounded-lg p-3">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green text-sm bg-green/10 border border-green/20 rounded-lg p-3">
          Transaction created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedAccount || !description.trim() || !amount.trim()}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default NewTransaction;
