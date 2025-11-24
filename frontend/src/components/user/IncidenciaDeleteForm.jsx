import { useState } from "react";
import { crearIncidenciaDelete } from "../../services/incidenciaService";

export function IncidenciaDeleteForm({ fichajes, onCreated }) {
  const [timeRecordId, setTimeRecordId] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!timeRecordId) {
      setError("Selecciona un fichaje.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await crearIncidenciaDelete({
        timeRecordId,
        comentarioUsuario: comentario || null,
      });

      setComentario("");
      setTimeRecordId("");

      if (onCreated) onCreated();
      alert("Incidencia de eliminación enviada correctamente.");
    } catch (err) {
      console.error(err);
      setError("Error creando la incidencia. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Eliminar fichaje</h2>

      <div>
        <label>
          Fichaje
          <select
            value={timeRecordId}
            onChange={(e) => setTimeRecordId(e.target.value)}
            required
          >
            <option value="">Selecciona un fichaje</option>
            {fichajes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Comentario (opcional)
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar incidencia"}
      </button>
    </form>
  );
}
