import React, { useEffect, useState } from 'react';
import { getMyRecords } from '../../services/timeRecordService';
import { formatDate, formatTime } from '../../utils/dateUtils';

export default function EventosTab() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    (async () => {
      const rec = await getMyRecords();
      setRecords(rec);
    })();
  }, []);

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card card-soft">
          <div className="card-body">
            <h5 className="card-title">Mis fichajes (eventos)</h5>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Aquí puedes ver el detalle de todos tus fichajes individuales
              (entradas, pausas, reanudaciones y salidas), ordenados del más
              reciente al más antiguo.
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
                    .sort(
                      (a, b) =>
                        new Date(b.instante) - new Date(a.instante)
                    )
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
  );
}
