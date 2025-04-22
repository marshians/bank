import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'https://localhost:3000',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'marshians',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'bank-ui',
});

export const initKeycloak = async () => {
  await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    scope: 'email profile',
  });
};

export default keycloak;