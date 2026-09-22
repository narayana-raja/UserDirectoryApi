import axios from "axios";
import { getAccessToken } from "../../auth/tokenStore";

const apiClient = axios.create({
  baseURL: "https://localhost:7146/api"
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default apiClient;
