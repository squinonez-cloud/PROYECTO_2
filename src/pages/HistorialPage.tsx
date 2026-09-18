import { useEffect, useState } from "react";
import { obtenerSesiones } from "../services/historialService";
import type { SesionHistorial } from "../services/historialService";
import "./HistorialPage.css";

export default function HistorialPage() {
  const [sesiones, setSesiones] = useState<SesionHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerSesiones();
        setSesiones(datos);
      } catch (err) {
        setError("No se pudo cargar el historial de sesiones");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <div className="historial-container">
      <h1>Historial de sesiones</h1>

      {cargando && <p>Cargando...</p>}
      {error && <p className="historial-error">{error}</p>}

      {!cargando && !error && (
        <table className="historial-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha de entrada</th>
              <th>Fecha de salida</th>
            </tr>
          </thead>
          <tbody>
            {sesiones.map((s) => (
              <tr key={s.id}>
                <td>{s.usuario}</td>
                <td>{s.fechaEntrada}</td>
                <td>{s.fechaSalida ?? "Sesión activa"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}