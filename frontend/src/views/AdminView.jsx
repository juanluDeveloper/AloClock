import React, { useEffect, useState } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  getAdminFichajes,
  exportCsv,
} from '../services/adminService';
import {
  listarIncidencias,
  aprobarIncidencia,
  rechazarIncidencia,
} from '../services/incidenciaService';

export default function AdminView() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newEmp, setNewEmp] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'USER',
  });
  const [error, setError] = useState(null);

  // incidencias
  const [incidencias, setIncidencias] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('PENDIENTE');
  const [loadingIncidencias, setLoadingIncidencias] = useState(false);

  const formatDate = (isoDateStr) => {
    if (!isoDateStr) return '';
    const [year, month, day] = isoDateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (isoDateTimeStr) => {
    if (!isoDateTimeStr) return '';
    const d = new Date(isoDateTimeStr);
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const loadEmployees = async () => {
    try {
      const emps = await getEmployees();
      setEmployees(emps);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        'No tienes permisos de administrador o ha ocurrido un error al cargar empleados.'
      );
    }
  };

  const loadRecords = async () => {
    try {
      const recs = await getAdminFichajes(
        selectedEmployeeId || null,
        startDate,
        endDate
      );
      setRecords(recs);
    } catch (err) {
      console.error(err);
    }
  };

  const loadIncidencias = async () => {
    try {
      setLoadingIncidencias(true);
      const estado =
        estadoFiltro === 'TODAS' || estadoFiltro === '' ? null : estadoFiltro;
      const data = await listarIncidencias(estado);
      setIncidencias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIncidencias(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadIncidencias();
  }, []);

  useEffect(() => {
    loadIncidencias();
  }, [estadoFiltro]);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(newEmp);
      setNewEmp({ nombre: '', email: '', password: '', rol: 'USER' });
      await loadEmployees();
    } catch (err) {
      console.error(err);
      alert('Error al crear empleado');
    }
  };

  const handleToggleActivo = async (emp) => {
    try {
      await updateEmployee(emp.id, { activo: !emp.activo });
      await loadEmployees();
    } catch (err) {
      console.error(err);
      alert('Error al actualizar empleado');
    }
  };

  const handleFilterRecords = async (e) => {
    e.preventDefault();
    await loadRecords();
  };

  const handleExport = async () => {
    try {
      const blob = await exportCsv(startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fichajes-alodent.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error al exportar CSV');
    }
  };

  const handleAprobarIncidencia = async (id) => {
    if (!window.confirm('¿Aprobar esta incidencia?')) return;
    try {
      await aprobarIncidencia(id);
      await loadIncidencias();
    } catch (err) {
      console.error(err);
      alert('Error al aprobar la incidencia');
    }
  };

  const handleRechazarIncidencia = async (id) => {
    const comentario = window.prompt('Motivo del rechazo:');
    if (comentario === null) return;
    try {
      await rechazarIncidencia(id, comentario);
      await loadIncidencias();
    } catch (err) {
      console.error(err);
      alert('Error al rechazar la incidencia');
    }
  };

  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-3 my-md-4">
      <div className="mb-3">
        <h2 className="mb-0">Panel administrador</h2>
        <small className="text-muted">
          Gestión de empleados, fichajes e incidencias
        </small>
      </div>

      <div className="row g-4">
        {/* Empleados */}
        <div className="col-12 col-lg-5">
          <div className="card card-soft mb-3">
            <div className="card-body">
              <h5 className="card-title">Empleados</h5>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Activo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.id}</td>
                        <td>
                          {emp.nombre}
                          <br />
                          <small className="text-muted">{emp.email}</small>
                        </td>
                        <td>{emp.rol}</td>
                        <td>{emp.activo ? 'Sí' : 'No'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary btn-pill"
                            onClick={() => handleToggleActivo(emp)}
                          >
                            {emp.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No hay empleados registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card card-soft">
            <div className="card-body">
              <h5 className="card-title">Crear nuevo empleado</h5>
              <form className="row g-2" onSubmit={handleCreateEmployee}>
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Nombre"
                    value={newEmp.nombre}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    value={newEmp.email}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Contraseña"
                    value={newEmp.password}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <select
                    className="form-select"
                    value={newEmp.rol}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, rol: e.target.value })
                    }
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-pill brand-bg border-0"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Fichajes + Incidencias */}
        <div className="col-12 col-lg-7">
          <div className="card card-soft mb-3">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-2 mb-sm-0">Fichajes</h5>
              </div>

              <form
                className="row g-2 align-items-end mb-3"
                onSubmit={handleFilterRecords}
              >
                <div className="col-12 col-md-4">
                  <label className="form-label mb-1">Empleado</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nombre} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label mb-1">Desde</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label mb-1">Hasta</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2 d-grid gap-1">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm btn-pill"
                  >
                    Buscar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm btn-pill"
                    onClick={handleExport}
                  >
                    Exportar CSV
                  </button>
                </div>
              </form>

              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Empleado</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Tipo</th>
                      <th>IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...records]
                      .sort(
                        (a, b) => new Date(b.instante) - new Date(a.instante)
                      )
                      .map((r) => (
                        <tr key={r.id}>
                          <td>{r.empleado?.nombre || '—'}</td>
                          <td>{formatDate(r.fecha)}</td>
                          <td>{formatTime(r.instante)}</td>
                          <td>{r.tipo}</td>
                          <td>
                            <small className="text-muted">
                              {r.ipOrigen || '—'}
                            </small>
                          </td>
                        </tr>
                      ))}
                    {records.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No hay fichajes para los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Incidencias */}
          <div className="card card-soft">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h5 className="card-title mb-0">Incidencias</h5>
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label mb-0 me-1">Estado</label>
                  <select
                    className="form-select form-select-sm"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                  >
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="APROBADA">Aprobadas</option>
                    <option value="RECHAZADA">Rechazadas</option>
                    <option value="TODAS">Todas</option>
                  </select>
                </div>
              </div>

              {loadingIncidencias ? (
                <p className="text-muted mb-0">Cargando incidencias...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Empleado</th>
                        <th>Tipo</th>
                        <th>Detalle</th>
                        <th>Comentario usuario</th>
                        <th>Estado</th>
                        <th>Resuelto por</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidencias.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center text-muted"
                          >
                            No hay incidencias para este filtro.
                          </td>
                        </tr>
                      )}
                      {incidencias.map((inc) => (
                        <tr key={inc.id}>
                          <td>{inc.id}</td>
                          <td>{inc.empleado?.nombre || '—'}</td>
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
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {inc.comentarioUsuario || (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>{inc.estado}</td>
                          <td>{inc.resueltoPor || '—'}</td>
                          <td>
                            {inc.estado === 'PENDIENTE' && (
                              <div className="d-flex flex-column flex-sm-row gap-1">
                                <button
                                  className="btn btn-success btn-sm btn-pill"
                                  onClick={() =>
                                    handleAprobarIncidencia(inc.id)
                                  }
                                >
                                  Aprobar
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm btn-pill"
                                  onClick={() =>
                                    handleRechazarIncidencia(inc.id)
                                  }
                                >
                                  Rechazar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p
                className="text-muted mb-0 mt-2"
                style={{ fontSize: '0.8rem' }}
              >
                Las incidencias aprobadas generarán o eliminarán fichajes en la
                tabla superior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}