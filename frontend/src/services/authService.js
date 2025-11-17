import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  return res.data.token;
};
