import api from './api';

export const getEmployees = async () => {
  const res = await api.get('/admin/empleados');
  return res.data;
};

export const createEmployee = async ({ nombre, email, password, rol }) => {
  const res = await api.post('/admin/empleados', {
    nombre,
    email,
    password,
    rol,
  });
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await api.put(`/admin/empleados/${id}`, data);
  return res.data;
};

export const getAdminFichajes = async (empleadoId, start, end) => {
  const params = {};
  if (empleadoId) params.empleadoId = empleadoId;
  if (start) params.start = start;
  if (end) params.end = end;
  const res = await api.get('/admin/fichajes', { params });
  return res.data;
};

export const exportCsv = async (start, end) => {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  const res = await api.get('/admin/export', {
    params,
    responseType: 'blob',
  });
  return res.data; // blob
};
