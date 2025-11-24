import React, { useEffect, useState } from 'react';
import {
  getMyJornadas,
  getMyRecords,
} from '../../services/timeRecordService';
import {
  toIsoDate,
  formatDateShort,
  formatMinutesToHHMM,
} from '../../utils/dateUtils';

export default function SemanasTab() {
  const [weekYear, setWeekYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState([]); // [{id,label,startIso,endIso}]
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [weekJornadas, setWeekJornadas] = useState([]);
  const [weekRecords, setWeekRecords] = useState([]);

  const generateWeeksForYear = (year) => {
    const weeksArray = [];
    let date = new Date(year, 0, 1);

    const day = date.getDay(); // 0 dom, 1 lun...
    const diffToMonday = (day + 6) % 7;
    date.setDate(date.getDate() - diffToMonday);

    let index = 0;
    while (true) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 6);

      if (start.getFullYear() > year && end.getFullYear() > year) break;
      if (end.getFullYear() < year) {
        date.setDate(date.getDate() + 7);
        continue;
      }

      const startIso = toIsoDate(start);
      const endIso = toIsoDate(end);
      const label = `Del ${formatDateShort(start)} al ${formatDateShort(
        end
      )}`;

      weeksArray.push({ id: index, label, startIso, endIso });
      index += 1;
      date.setDate(date.getDate() + 7);
    }

    return weeksArray;
  };

  useEffect(() => {
    const w = generateWeeksForYear(weekYear);
    setWeeks(w);

    const today = new Date();
    if (today.getFullYear() === weekYear) {
      const todayIso = toIsoDate(today);
      const idx = w.findIndex(
        (wk) => wk.startIso <= todayIso && wk.endIso >= todayIso
      );
      setSelectedWeekIndex(idx >= 0 ? idx : 0);
    } else {
      setSelectedWeekIndex(0);
    }
  }, [weekYear]);

  const loadWeekData = async (week) => {
    if (!week) return;
    const { startIso, endIso } = week;

    const [jorn, rec] = await Promise.all([
      getMyJornadas(startIso, endIso),
      getMyRecords(),
    ]);

    const filteredRec = rec.filter(
      (r) => r.fecha >= startIso && r.fecha <= endIso
    );

    setWeekJornadas(jorn);
    setWeekRecords(filteredRec);
  };

  useEffect(() => {
    if (weeks.length > 0) {
      loadWeekData(weeks[selectedWeekIndex]);
    }
  }, [weeks, selectedWeekIndex]);

  const handleWeekChange = (e) => {
    const idx = Number(e.target.value);
    setSelectedWeekIndex(idx);
  };

  const getMinutesForDay = (isoDate) => {
    const j = weekJornadas.find((x) => x.fecha === isoDate);
    return j ? j.minutosTrabajados : 0;
  };

  const weekDays = () => {
    if (!weeks[selectedWeekIndex]) return [];
    const start = new Date(weeks[selectedWeekIndex].startIso);
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDaysArray = weekDays();

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card card-soft">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-end mb-3 gap-2">
              <div>
                <h5 className="card-title mb-1">Fichajes por semana</h5>
                <small className="text-muted">
                  Consulta tus fichajes agrupados por semana (Lunes a Domingo).
                </small>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <div>
                  <label className="form-label mb-1">Año</label>
                  <select
                    className="form-select form-select-sm"
                    value={weekYear}
                    onChange={(e) => setWeekYear(Number(e.target.value))}
                  >
                    {Array.from({ length: 6 }).map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="form-label mb-1">Semana</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedWeekIndex}
                    onChange={handleWeekChange}
                  >
                    {weeks.map((wk, idx) => (
                      <option key={wk.id} value={idx}>
                        {wk.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    {weekDaysArray.map((d, i) => (
                      <th key={i}>
                        {d.toLocaleDateString('es-ES', {
                          weekday: 'short',
                        })}
                        <br />
                        <small className="text-muted">
                          {formatDateShort(d)}
                        </small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {weekDaysArray.map((d, i) => {
                      const iso = toIsoDate(d);
                      const dayRecords = [...weekRecords]
                        .filter((r) => r.fecha === iso)
                        .sort(
                          (a, b) =>
                            new Date(a.instante) - new Date(b.instante)
                        );

                      return (
                        <td key={i} style={{ verticalAlign: 'top' }}>
                          {dayRecords.length === 0 ? (
                            <span className="text-muted">Sin fichajes</span>
                          ) : (
                            dayRecords.map((r) => (
                              <div
                                key={r.id}
                                className="d-flex justify-content-between"
                              >
                                <span className="me-1">
                                  {new Date(r.instante)
                                    .toLocaleTimeString('es-ES', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                    .slice(0, 5)}
                                </span>
                                <span className="badge bg-light text-dark border">
                                  {r.tipo}
                                </span>
                              </div>
                            ))
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="table-light">
                    {weekDaysArray.map((d, i) => {
                      const iso = toIsoDate(d);
                      const minutes = getMinutesForDay(iso);
                      return (
                        <td key={i}>
                          <small className="text-muted">
                            Diario:{' '}
                            {minutes > 0
                              ? formatMinutesToHHMM(minutes)
                              : '0:00'}
                          </small>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              * Los tiempos diarios se calculan a partir de los fichajes de
              entrada / pausa / reanudación / salida registrados esa semana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}