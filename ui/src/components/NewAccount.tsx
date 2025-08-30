import { useState } from 'react';
import api from '../api';

interface NewAccountProps {
  updateAccounts: () => Promise<void>;
}

const NewAccount: React.FC<NewAccountProps> = ({ updateAccounts }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await api.createAccount(email.trim());
      await updateAccounts();
      
      setEmail('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-subtext1 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-primary w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="user@example.com"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-red text-sm bg-red/10 border border-red/20 rounded-lg p-3">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green text-sm bg-green/10 border border-green/20 rounded-lg p-3">
          Account created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
};

export default NewAccount;
