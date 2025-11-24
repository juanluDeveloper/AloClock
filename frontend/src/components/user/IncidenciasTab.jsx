import React, { useEffect, useState } from 'react';
import { getMyRecords } from '../../services/timeRecordService';
import {
  crearIncidenciaAdd,
  crearIncidenciaDelete,
  crearIncidenciaEdit,
  misIncidencias,
} from '../../services/incidenciaService';
import { formatDate, formatTime } from '../../utils/dateUtils';

export default function IncidenciasTab() {
  const [records, setRecords] = useState([]);
  const [incidencias, setIncidencias] = useState([]);

  // ADD
  const [addRecordType, setAddRecordType] = useState('ENTRADA');
  const [addFecha, setAddFecha] = useState('');
  const [addHora, setAddHora] = useState('');
  const [addComentario, setAddComentario] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // DELETE
  const [delTimeRecordId, setDelTimeRecordId] = useState('');
  const [delComentario, setDelComentario] = useState('');
  const [delLoading, setDelLoading] = useState(false);

  // EDIT
  const [editTimeRecordId, setEditTimeRecordId] = useState('');
  const [editFecha, setEditFecha] = useState('');
  const [editHora, setEditHora] = useState('');
  const [editComentario, setEditComentario] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const [rec, incs] = await Promise.all([
        getMyRecords(),
        misIncidencias(),
      ]);
      setRecords(rec);
      setIncidencias(incs);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error cargando datos de incidencias.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      await crearIncidenciaAdd({
        recordType: addRecordType,
        fecha: addFecha,
        hora: addHora,
        comentario: addComentario || null,
      });
      setAddComentario('');
      setAddFecha('');
      setAddHora('');
      await loadData();
      alert('Incidencia de añadir fichaje enviada correctamente.');
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la incidencia. Revisa los datos.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    if (!delTimeRecordId) {
      alert('Selecciona un fichaje a eliminar.');
      return;
    }
    try {
      setDelLoading(true);
      await crearIncidenciaDelete({
        timeRecordId: delTimeRecordId,
        comentario: delComentario || null,
      });
      setDelComentario('');
      setDelTimeRecordId('');
      await loadData();
      alert('Incidencia de eliminación enviada correctamente.');
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la incidencia de eliminación.');
    } finally {
      setDelLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editTimeRecordId) {
      alert('Selecciona un fichaje a modificar.');
      return;
    }
    try {
      setEditLoading(true);
      await crearIncidenciaEdit({
        timeRecordId: editTimeRecordId,
        fecha: editFecha,
        hora: editHora,
        comentario: editComentario || null,
      });
      setEditComentario('');
      setEditFecha('');
      setEditHora('');
      setEditTimeRecordId('');
      await loadData();
      alert('Incidencia de edición enviada correctamente.');
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la incidencia de edición.');
    } finally {
      setEditLoading(false);
    }
  };

  const estadoBonito = (e) => {
    if (e === 'PENDIENTE') return 'Pendiente';
    if (e === 'APROBADA') return 'Aprobada';
    if (e === 'RECHAZADA') return 'Rechazada';
    return e;
  };

  const recordsOptions = [...records]
    .sort((a, b) => new Date(b.instante) - new Date(a.instante))
    .map((r) => ({
      id: r.id,
      label: `${formatDate(r.fecha)} · ${formatTime(r.instante)} · ${r.tipo}`,
    }));

  return (
    <div className="row g-4">
      {/* Col izquierda: formularios de incidencias */}
      <div className="col-12 col-lg-5">
        {/* ADD */}
        <div className="card card-soft mb-3">
          <div className="card-body">
            <h5 className="card-title">Solicitar añadir fichaje</h5>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Usa este formulario si olvidaste fichar una entrada, pausa,
              reanudación o salida.
            </p>

            <form className="row g-2" onSubmit={handleSubmitAdd}>
              <div className="col-12">
                <label className="form-label mb-1">Tipo de fichaje</label>
                <select
                  className="form-select form-select-sm"
                  value={addRecordType}
                  onChange={(e) => setAddRecordType(e.target.value)}
                >
                  <option value="ENTRADA">Entrada</option>
                  <option value="PAUSA">Pausa</option>
                  <option value="REANUDACION">Reanudación</option>
                  <option value="SALIDA">Salida</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Fecha</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={addFecha}
                  onChange={(e) => setAddFecha(e.target.value)}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Hora</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  value={addHora}
                  onChange={(e) => setAddHora(e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label mb-1">Comentario (opcional)</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  value={addComentario}
                  onChange={(e) => setAddComentario(e.target.value)}
                  placeholder="Ej: me olvidé de fichar la entrada al llegar."
                />
              </div>
              <div className="col-12 d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm btn-pill brand-bg border-0"
                  disabled={addLoading}
                >
                  {addLoading ? 'Enviando...' : 'Enviar incidencia'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* DELETE */}
        <div className="card card-soft mb-3">
          <div className="card-body">
            <h5 className="card-title">Solicitar eliminación de fichaje</h5>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Si hay un fichaje duplicado o erróneo, puedes pedir que se elimine.
            </p>

            <form className="row g-2" onSubmit={handleSubmitDelete}>
              <div className="col-12">
                <label className="form-label mb-1">Fichaje</label>
                <select
                  className="form-select form-select-sm"
                  value={delTimeRecordId}
                  onChange={(e) => setDelTimeRecordId(e.target.value)}
                  required
                >
                  <option value="">Selecciona un fichaje</option>
                  {recordsOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label mb-1">
                  Comentario (opcional)
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  value={delComentario}
                  onChange={(e) => setDelComentario(e.target.value)}
                  placeholder="Ej: fiché dos veces seguidas por error."
                />
              </div>
              <div className="col-12 d-grid">
                <button
                  type="submit"
                  className="btn btn-outline-danger btn-sm btn-pill"
                  disabled={delLoading}
                >
                  {delLoading ? 'Enviando...' : 'Solicitar eliminación'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* EDIT */}
        <div className="card card-soft">
          <div className="card-body">
            <h5 className="card-title">Solicitar modificación de fichaje</h5>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Si la hora de un fichaje es incorrecta, puedes solicitar el ajuste.
            </p>

            <form className="row g-2" onSubmit={handleSubmitEdit}>
              <div className="col-12">
                <label className="form-label mb-1">Fichaje</label>
                <select
                  className="form-select form-select-sm"
                  value={editTimeRecordId}
                  onChange={(e) => setEditTimeRecordId(e.target.value)}
                  required
                >
                  <option value="">Selecciona un fichaje</option>
                  {recordsOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Nueva fecha</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={editFecha}
                  onChange={(e) => setEditFecha(e.target.value)}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Nueva hora</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  value={editHora}
                  onChange={(e) => setEditHora(e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label mb-1">
                  Comentario (opcional)
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  value={editComentario}
                  onChange={(e) => setEditComentario(e.target.value)}
                  placeholder="Ej: fiché 10 minutos más tarde de lo real."
                />
              </div>
              <div className="col-12 d-grid">
                <button
                  type="submit"
                  className="btn btn-outline-primary btn-sm btn-pill"
                  disabled={editLoading}
                >
                  {editLoading ? 'Enviando...' : 'Solicitar modificación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Col derecha: listado de mis incidencias */}
      <div className="col-12 col-lg-7">
        <div className="card card-soft">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">Mis incidencias</h5>
              <span className="badge rounded-pill brand-badge">
                Estado de revisión
              </span>
            </div>

            {error && (
              <div className="alert alert-danger py-2 mb-2">{error}</div>
            )}

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha solicitud</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>Estado</th>
                    <th>Comentario admin</th>
                  </tr>
                </thead>
                <tbody>
                  {incidencias.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        Aún no has enviado ninguna incidencia.
                      </td>
                    </tr>
                  )}
                  {incidencias.map((inc) => (
                    <tr key={inc.id}>
                      <td>
                        {inc.createdAt
                          ? new Date(inc.createdAt).toLocaleString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </td>
                      <td>{inc.tipo}</td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {inc.tipo === 'ADD' && (
                          <>
                            Añadir <strong>{inc.recordType}</strong> el{' '}
                            {inc.fechaObjetivo || '-'}{' '}
                            {inc.instanteObjetivo &&
                              formatTime(inc.instanteObjetivo)}
                          </>
                        )}
                        {inc.tipo === 'DELETE' && (
                          <>
                            Eliminar fichaje ID{' '}
                            <strong>#{inc.timeRecordIdAfectado}</strong>
                          </>
                        )}
                        {inc.tipo === 'EDIT' && (
                          <>
                            Modificar fichaje ID{' '}
                            <strong>#{inc.timeRecordIdAfectado}</strong> a{' '}
                            {inc.fechaObjetivo || '-'}{' '}
                            {inc.instanteObjetivo &&
                              formatTime(inc.instanteObjetivo)}
                          </>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {estadoBonito(inc.estado)}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {inc.comentarioAdmin || (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p
              className="text-muted mb-0 mt-2"
              style={{ fontSize: '0.8rem' }}
            >
              Las incidencias son revisadas por el administrador. Recibirás el
              ajuste en tus fichajes una vez sean aprobadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}