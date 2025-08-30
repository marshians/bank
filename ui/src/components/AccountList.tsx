import { type Account } from '../api';
import { formatCurrency } from '../utils';

interface AccountListProps {
  accounts: Account[];
  onNewAccount: () => void;
  onAccountClick: (account: Account) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, onNewAccount, onAccountClick }) => {
  return (
    <div className="space-y-4">
      {/* Header with New Account Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-text">All Accounts</h2>
        <button
          onClick={onNewAccount}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New Account</span>
        </button>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-subtext1">No accounts found</div>
          <button 
            onClick={onNewAccount}
            className="mt-4 btn-primary"
          >
            Create your first account
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <button
              key={account._id}
              onClick={() => onAccountClick(account)}
              className="w-full flex items-center justify-between p-4 bg-surface1 rounded-lg border border-surface2 hover:bg-surface2/50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-50"
            >
              <div className="flex-1">
                <div className="text-text font-medium">{account._id}</div>
                <div className="text-subtext1 text-sm">Click to view transactions</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${account.balance >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(account.balance)}
                </div>
                <div className="text-subtext1 text-sm">
                  <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountList;
