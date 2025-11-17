import api from './api';

export const punch = async (tipo) => {
  await api.post('/fichajes', { tipo });
};

export const getMyRecords = async () => {
  const res = await api.get('/fichajes/mis-registros');
  return res.data;
};

export const getMyJornadas = async (start, end) => {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  const res = await api.get('/fichajes/mis-jornadas', { params });
  return res.data;
};
