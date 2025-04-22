import axios from "axios";

import keycloak from "../keycloak";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken(30); // Refresh token if it will expire in 30 seconds
      } catch (error) {
        console.error("Token refresh failed, redirecting to login:", error);
        keycloak.login(); // Redirect to login if token refresh fails
        return Promise.reject(error);
      }
    }
    config.headers.Authorization = `Bearer ${keycloak.token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const api = {
  getAccount: async () => {
    try {
      const response = await apiClient.get("/api/accounts/mine");
      return response.data;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  },

  getAccounts: async () => {
    try {
      const response = await apiClient.get("/api/accounts");
      return response.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  },

  createAccount: async (email: string) => {
    try {
      const response = await apiClient.post("/api/accounts", { _id: email });
      return response.data;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },

  getTransactions: async () => {
    try {
      const response = await apiClient.get("/api/transactions");
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  createTransaction: async (
    account: string,
    description: string,
    amount: string
  ) => {
    try {
      const response = await apiClient.post("/api/transactions", {
        account_id: account,
        description: description,
        pennies: parseInt(amount.replace(".", ""), 10),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },
};

export default api;
