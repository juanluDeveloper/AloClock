import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// guardamos el token en memoria del módulo
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
