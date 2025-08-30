import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initKeycloak } from './keycloak'

// Prevent double initialization
let isAppRendered = false;

const renderApp = () => {
  if (isAppRendered) return;
  
  isAppRendered = true;
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
};

// Initialize Keycloak before rendering the app
initKeycloak().then(() => {
  renderApp();
}).catch(error => {
  console.error('Failed to initialize Keycloak:', error);
  // Still render the app even if Keycloak fails to initialize
  renderApp();
});
