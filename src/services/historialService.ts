const BASE_URL = "http://localhost:4000/api";
const USE_MOCK = true;

export interface SesionHistorial {
  id: number;
  usuario: string;
  fechaEntrada: string;
  fechaSalida: string | null;
}

const sesionesSimuladas: SesionHistorial[] = [
  { id: 1, usuario: "Jonathan Valenzuela", fechaEntrada: "2026-09-16 18:05", fechaSalida: "2026-09-16 18:40" },
  { id: 2, usuario: "Yanira Garcia", fechaEntrada: "2026-09-16 17:20", fechaSalida: "2026-09-16 17:55" },
  { id: 3, usuario: "Usuario de prueba", fechaEntrada: "2026-09-17 09:10", fechaSalida: null },
];

export async function obtenerSesiones(): Promise<SesionHistorial[]> {
  if (USE_MOCK) {
    await esperar(500);
    return sesionesSimuladas;
  }

  const response = await fetch(`${BASE_URL}/sesiones`);
  if (!response.ok) {
    throw new Error("No se pudo obtener el historial de sesiones");
  }
  return response.json();
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}