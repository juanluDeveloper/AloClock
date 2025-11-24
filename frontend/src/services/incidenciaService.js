import api from './api';

// ---------- USUARIO ----------

export const crearIncidenciaAdd = async ({
  recordType,
  fecha,
  hora,
  comentario,
}) => {
  const res = await api.post('/incidencias/add', {
    recordType,
    fecha,
    hora,
    comentario,
  });
  return res.data;
};

export const crearIncidenciaDelete = async ({
  timeRecordId,
  comentario,
}) => {
  const res = await api.post('/incidencias/delete', {
    timeRecordId,
    comentario,
  });
  return res.data;
};

export const crearIncidenciaEdit = async ({
  timeRecordId,
  fecha,
  hora,
  comentario,
}) => {
  const res = await api.post('/incidencias/edit', {
    timeRecordId,
    fecha,
    hora,
    comentario,
  });
  return res.data;
};

export const misIncidencias = async () => {
  const res = await api.get('/incidencias/mis');
  return res.data;
};

// ---------- ADMIN ----------

export const listarIncidencias = async (estado) => {
  const res = await api.get('/admin/incidencias', {
    params: { estado },
  });
  return res.data;
};

export const aprobarIncidencia = async (id) => {
  const res = await api.post(`/admin/incidencias/${id}/aprobar`, {});
  return res.data;
};

export const rechazarIncidencia = async (id, comentarioAdmin) => {
  const res = await api.post(`/admin/incidencias/${id}/rechazar`, {
    comentarioAdmin,
  });
  return res.data;
};