import Keycloak from 'keycloak-js';

let keycloak: Keycloak | null = null;
let initializationPromise: Promise<boolean> | null = null;

const createKeycloakInstance = () => {
  if (!keycloak) {
    keycloak = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL || 'https://auth.marsh.gg',
      realm: import.meta.env.VITE_KEYCLOAK_REALM || 'marshians',
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'bank-ui',
    });
  }
  return keycloak;
};

export const initKeycloak = async (): Promise<boolean> => {
  // Return existing promise if initialization is already in progress
  if (initializationPromise) {
    return initializationPromise;
  }

  const keycloakInstance = createKeycloakInstance();
  
  // Check if already initialized
  if (keycloakInstance.authenticated !== undefined) {
    return Promise.resolve(keycloakInstance.authenticated);
  }
  
  initializationPromise = keycloakInstance.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    scope: 'email profile',
  }).catch(error => {
    console.error('Keycloak initialization failed:', error);
    // Reset the promise so we can try again
    initializationPromise = null;
    throw error;
  });

  return initializationPromise;
};

export default createKeycloakInstance();
