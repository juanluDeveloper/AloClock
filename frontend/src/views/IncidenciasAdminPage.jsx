import { useEffect, useState } from "react";
import {
  listarIncidencias,
  aprobarIncidencia,
  rechazarIncidencia,
} from "../services/incidenciaService";

export function IncidenciasAdminPage() {
  const [estadoFiltro, setEstadoFiltro] = useState("PENDIENTE");
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  async function cargar() {
    setLoading(true);

    const estado =
      estadoFiltro === "TODAS" || estadoFiltro === "" ? null : estadoFiltro;

    const data = await listarIncidencias(estado);
    setIncidencias(data);

    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, [estadoFiltro]);

  async function aprobar(id) {
    if (!window.confirm("¿Aprobar esta incidencia?")) return;
    await aprobarIncidencia(id);
    cargar();
  }

  async function rechazar(id) {
    const comentario = window.prompt("Motivo del rechazo:");
    if (comentario === null) return;
    await rechazarIncidencia(id, comentario);
    cargar();
  }

  return (
    <div>
      <h1>Gestión de incidencias</h1>

      <div>
        <label>
          Estado:
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADA">Aprobadas</option>
            <option value="RECHAZADA">Rechazadas</option>
            <option value="TODAS">Todas</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
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
            {incidencias.map((inc) => (
              <tr key={inc.id}>
                <td>{inc.id}</td>
                <td>{inc.empleadoEmail || "-"}</td>
                <td>{inc.tipo}</td>
                <td>
                  {inc.tipo === "ADD" && (
                    <>
                      Añadir {inc.recordType} — {inc.fechaObjetivo} —
                      {inc.instanteObjetivo &&
                        new Date(inc.instanteObjetivo).toLocaleTimeString()}
                    </>
                  )}
                  {inc.tipo === "DELETE" && (
                    <>Eliminar fichaje #{inc.timeRecordIdAfectado}</>
                  )}
                </td>
                <td>{inc.comentarioUsuario || "-"}</td>
                <td>{inc.estado}</td>
                <td>{inc.resueltoPor || "-"}</td>

                <td>
                  {inc.estado === "PENDIENTE" && (
                    <>
                      <button onClick={() => aprobar(inc.id)}>Aprobar</button>
                      <button onClick={() => rechazar(inc.id)}>Rechazar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
