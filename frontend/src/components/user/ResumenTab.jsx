import React, { useEffect, useState } from 'react';
import {
  punch,
  getMyRecords,
  getMyJornadas,
} from '../../services/timeRecordService';
import { formatDate, formatTime, toIsoDate } from '../../utils/dateUtils';

export default function ResumenTab() {
  const [records, setRecords] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const todayIso = (() => {
    const today = new Date();
    return toIsoDate(today);
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
    // carga inicial sin filtros
    (async () => {
      const [rec, jorn] = await Promise.all([
        getMyRecords(),
        getMyJornadas(),
      ]);
      setRecords(rec);
      setJornadas(jorn);
    })();
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

  const handleFilter = async (e) => {
    e.preventDefault();
    await loadData();
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

  return (
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
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .map((j) => (
                      <tr key={j.fecha}>
                        <td>{formatDate(j.fecha)}</td>
                        <td>
                          {j.primeraEntrada
                            ? formatTime(j.primeraEntrada)
                            : '-'}
                        </td>
                        <td>
                          {j.ultimaSalida
                            ? formatTime(j.ultimaSalida)
                            : '-'}
                        </td>
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
  );
}