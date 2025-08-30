import keycloak from '../keycloak';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-mantle border-b border-surface2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 p-2 bg-surface2 rounded-lg border-2 border-overlay1">
              <img
                className="h-6 w-6"
                src="/bank-icon.svg"
                alt="Bank logo"
              />
            </div>
            <div className="text-xl font-semibold text-text">
              Marshians Bank
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {keycloak.authenticated && (
              <>
                <span className="text-subtext1 text-sm">
                  Welcome, {keycloak.tokenParsed?.preferred_username}
                </span>
                <button
                  onClick={() => keycloak.logout()}
                  className="btn-danger"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
