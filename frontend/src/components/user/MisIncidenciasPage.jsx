import { useEffect, useState } from "react";
import { misIncidencias } from "../../services/incidenciaService";

export function MisIncidenciasPage() {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await misIncidencias();
        setIncidencias(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando tus incidencias.");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  function estadoBonito(e) {
    if (e === "PENDIENTE") return "Pendiente";
    if (e === "APROBADA") return "Aprobada";
    if (e === "RECHAZADA") return "Rechazada";
    return e;
  }

  if (loading) return <p>Cargando incidencias...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Mis incidencias</h1>

      {incidencias.length === 0 ? (
        <p>No tienes incidencias todavía.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Detalle</th>
              <th>Estado</th>
              <th>Comentario Admin</th>
            </tr>
          </thead>

          <tbody>
            {incidencias.map((inc) => (
              <tr key={inc.id}>
                <td>{new Date(inc.createdAt).toLocaleString()}</td>
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

                <td>{estadoBonito(inc.estado)}</td>
                <td>{inc.comentarioAdmin || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
