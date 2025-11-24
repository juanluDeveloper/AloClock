import { useState } from "react";
import { crearIncidenciaAdd } from "../services/incidenciaService";

export function IncidenciaAddForm({ onCreated }) {
  const [recordType, setRecordType] = useState("ENTRADA");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await crearIncidenciaAdd({
        recordType,
        fecha,
        hora,
        comentarioUsuario: comentario,
      });

      if (onCreated) onCreated();
      alert("Incidencia creada con éxito");
    } catch (err) {
      console.error(err);
      setError("Error creando la incidencia");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* campos como los teníamos antes */}
    </form>
  );
}
