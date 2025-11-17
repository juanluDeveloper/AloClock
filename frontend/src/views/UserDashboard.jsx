import React, { useEffect, useState } from 'react';
import { punch, getMyRecords, getMyJornadas } from '../services/timeRecordService';
import '../styles.css';

export default function UserDashboard() {
  const [records, setRecords] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('resumen'); // 'resumen' | 'eventos'

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

  const todayIso = (() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();

  const loadData = async () => {
    const [rec, jorn] = await Promise.all([
      getMyRecords(),
      getMyJornadas(startDate, endDate),
    ]);
    setRecords(rec);
    setJornadas(jorn);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePunch = async (tipo) => {
    try {
      await punch(tipo);
      await loadData();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || err.response?.data || err.message;
      alert(`Error al fichar (${tipo}): ${msg}`);
    }
  };

  const getEstadoActual = () => {
    if (!records || records.length === 0) return 'FUERA';
    const last = records[records.length - 1];
    switch (last.tipo) {
      case 'ENTRADA':
      case 'REANUDACION':
        return 'TRABAJANDO';
      case 'PAUSA':
        return 'EN_PAUSA';
      case 'SALIDA':
      default:
        return 'FUERA';
    }
  };

  const estado = getEstadoActual();
  const canEntrar = estado === 'FUERA';
  const canPausar = estado === 'TRABAJANDO';
  const canReanudar = estado === 'EN_PAUSA';
  const canSalir = estado === 'TRABAJANDO' || estado === 'EN_PAUSA';

  const jornadaHoy = jornadas.find((j) => j.fecha === todayIso);

  const handleFilter = async (e) => {
    e.preventDefault();
    const jorn = await getMyJornadas(startDate, endDate);
    setJornadas(jorn);
  };

  return (
    <div className="container my-3 my-md-4">
      {/* CABECERA / HERO */}
      <div className="hero-banner mb-4">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-7">
            <div className="d-flex align-items-center mb-2">
              <img
                src="/images/alodent-logo.png"
                alt="Clínica Dental Alodent"
                className="hero-logo me-2"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div>
                <h4 className="mb-0">AloClock</h4>
                <small className="text-muted">
                  Registro de jornada · Clínica Dental Alodent
                </small>
              </div>
            </div>
            <p className="mb-1">
              Ficha tus entradas, pausas y salidas de forma sencilla y cumpliendo
              con el Real Decreto-ley 8/2019.
            </p>
            <span className="badge rounded-pill brand-badge">Panel trabajador</span>
          </div>
          <div className="col-12 col-md-5">
            <div
              className="hero-photo"
              style={{ backgroundImage: "url('/images/alodent-exterior.jpg')" }}
            />
          </div>
        </div>
      </div>

      {/* TABS RESUMEN / EVENTOS */}
      <ul className="nav nav-pills mb-3">
        <li className="nav-item">
          <button
            className={
              'nav-link' + (activeTab === 'resumen' ? ' active brand-bg text-white' : '')
            }
            onClick={() => setActiveTab('resumen')}
          >
            Resumen
          </button>
        </li>
        <li className="nav-item">
          <button
            className={
              'nav-link' + (activeTab === 'eventos' ? ' active brand-bg text-white' : '')
            }
            onClick={() => setActiveTab('eventos')}
          >
            Mis fichajes (eventos)
          </button>
        </li>
      </ul>

      {activeTab === 'resumen' && (
        <div className="row g-4">
          {/* Col izquierda: estado + jornada hoy */}
          <div className="col-12 col-lg-5">
            <div className="card card-soft mb-3">
              <div className="card-body">
                <p className="mb-1 text-muted">Estado actual</p>
                <h5>
                  {estado === 'FUERA' && 'Fuera de jornada'}
                  {estado === 'TRABAJANDO' && 'Trabajando'}
                  {estado === 'EN_PAUSA' && 'En pausa'}
                </h5>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    className="btn btn-success btn-pill"
                    onClick={() => handlePunch('ENTRADA')}
                    disabled={!canEntrar}
                  >
                    Entrada
                  </button>
                  <button
                    className="btn btn-warning btn-pill"
                    onClick={() => handlePunch('PAUSA')}
                    disabled={!canPausar}
                  >
                    Pausa
                  </button>
                  <button
                    className="btn btn-info btn-pill"
                    onClick={() => handlePunch('REANUDACION')}
                    disabled={!canReanudar}
                  >
                    Reanudar
                  </button>
                  <button
                    className="btn btn-danger btn-pill"
                    onClick={() => handlePunch('SALIDA')}
                    disabled={!canSalir}
                  >
                    Salida
                  </button>
                </div>
              </div>
            </div>

            <div className="card card-soft">
              <div className="card-body">
                <h5 className="card-title">
                  Jornada de hoy{' '}
                  <span className="badge rounded-pill brand-badge ms-1">
                    {formatDate(todayIso)}
                  </span>
                </h5>
                {jornadaHoy ? (
                  <ul className="list-unstyled mb-0 mt-2">
                    <li>
                      <strong>Primera entrada:</strong>{' '}
                      {jornadaHoy.primeraEntrada
                        ? formatTime(jornadaHoy.primeraEntrada)
                        : '-'}
                    </li>
                    <li>
                      <strong>Última salida:</strong>{' '}
                      {jornadaHoy.ultimaSalida
                        ? formatTime(jornadaHoy.ultimaSalida)
                        : '-'}
                    </li>
                    <li>
                      <strong>Minutos trabajados:</strong>{' '}
                      {jornadaHoy.minutosTrabajados}
                    </li>
                  </ul>
                ) : (
                  <p className="text-muted mt-2 mb-0">
                    Todavía no se ha registrado ningún fichaje hoy.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Col derecha: filtros + jornadas */}
          <div className="col-12 col-lg-7">
            <div className="card card-soft mb-3">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-2 mb-sm-0">Jornadas</h5>
                </div>

                <form
                  className="row g-2 align-items-end mb-3"
                  onSubmit={handleFilter}
                >
                  <div className="col-12 col-sm-4">
                    <label className="form-label mb-1">Desde</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label mb-1">Hasta</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-sm-4 d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm btn-pill mt-3 mt-sm-0"
                    >
                      Aplicar filtro
                    </button>
                  </div>
                </form>

                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Primera entrada</th>
                        <th>Última salida</th>
                        <th>Minutos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...jornadas]
                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // más nuevas primero
                        .map((j) => (
                          <tr key={j.fecha}>
                            <td>{formatDate(j.fecha)}</td>
                            <td>{j.primeraEntrada ? formatTime(j.primeraEntrada) : '-'}</td>
                            <td>{j.ultimaSalida ? formatTime(j.ultimaSalida) : '-'}</td>
                            <td>{j.minutosTrabajados}</td>
                          </tr>
                        ))}
                      {jornadas.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            No hay jornadas en el rango seleccionado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'eventos' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card card-soft">
              <div className="card-body">
                <h5 className="card-title">Mis fichajes (eventos)</h5>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Aquí puedes ver el detalle de todos tus fichajes individuales
                  (entradas, pausas, reanudaciones y salidas).
                </p>
                <div
                  className="table-responsive"
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '20%' }}>Tipo</th>
                        <th style={{ width: '40%' }}>Fecha</th>
                        <th style={{ width: '40%' }}>Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...records]
                        .sort((a, b) => new Date(b.instante) - new Date(a.instante)) // más recientes arriba
                        .map((r) => (
                          <tr key={r.id}>
                            <td>
                              <span
                                className={
                                  "badge " +
                                  (r.tipo === "ENTRADA" ? "bg-success" :
                                  r.tipo === "SALIDA" ? "bg-danger" :
                                  r.tipo === "PAUSA" ? "bg-warning text-dark" :
                                  r.tipo === "REANUDACION" ? "bg-primary" :
                                  "bg-light text-dark")
                                }
                              >
                                {r.tipo}
                              </span>
                            </td>
                            <td>{formatDate(r.fecha)}</td>
                            <td>{formatTime(r.instante)}</td>
                          </tr>
                        ))}
                      {records.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            Aún no hay fichajes registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}