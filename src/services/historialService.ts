const BASE_URL = "http://localhost:4000/api";

export interface SesionHistorial {
  id: number;
  usuario: string;
  fechaEntrada: string;
  fechaSalida: string | null;
}

export async function obtenerSesiones(): Promise<SesionHistorial[]> {
  const response = await fetch(`${BASE_URL}/sesiones`);
  if (!response.ok) {
    throw new Error("No se pudo obtener el historial de sesiones");
  }
  return response.json();
}