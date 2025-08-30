import { useEffect, useState } from 'react';
import { initKeycloak } from './keycloak';
import Navbar from './components/Navbar';
import Content from './components/Content';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        await initKeycloak();
        setKeycloakInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        setInitError('Failed to initialize authentication');
      }
    };

    initializeKeycloak();
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red text-xl font-semibold mb-2">Authentication Error</div>
          <div className="text-subtext1">{initError}</div>
        </div>
      </div>
    );
  }

  if (!keycloakInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Initializing authentication..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Content />
      </main>
    </div>
  );
}

export default App;
