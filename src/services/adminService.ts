const BASE_URL = "http://localhost:4000/api";
const USE_MOCK = true;

export interface Orden {
  id: number;
  usuario: string;
  total: number;
  estado: string;
  fecha: string;
}

export interface CuentaBalance {
  codigo: string;
  cuenta: string;
  tipo: string;
  totalCargos: number;
  totalAbonos: number;
}

export interface Balance {
  cuentas: CuentaBalance[];
  totalCargos: number;
  totalAbonos: number;
  cuadra: boolean;
}

const ordenesSimuladas: Orden[] = [
  { id: 1, usuario: "Jonathan Nyss", total: 850, estado: "Pagada", fecha: "2026-09-24" },
  { id: 2, usuario: "Yanira Garcia", total: 420, estado: "Pendiente", fecha: "2026-09-25" },
  { id: 3, usuario: "Usuario de prueba", total: 1200, estado: "Pagada", fecha: "2026-09-26" },
];

const cuentasSimuladas: CuentaBalance[] = [
  { codigo: "1000", cuenta: "Caja", tipo: "Activo", totalCargos: 2470, totalAbonos: 0 },
  { codigo: "1100", cuenta: "Cuentas por cobrar", tipo: "Activo", totalCargos: 420, totalAbonos: 420 },
  { codigo: "2000", cuenta: "Cuentas por pagar", tipo: "Pasivo", totalCargos: 0, totalAbonos: 850 },
  { codigo: "3000", cuenta: "Capital", tipo: "Patrimonio", totalCargos: 0, totalAbonos: 1200 },
  { codigo: "4000", cuenta: "Ventas", tipo: "Ingreso", totalCargos: 0, totalAbonos: 850 },
];

const balanceSimulado: Balance = {
  cuentas: cuentasSimuladas,
  totalCargos: 2890,
  totalAbonos: 2890,
  cuadra: true,
};

export async function obtenerOrdenes(): Promise<Orden[]> {
  if (USE_MOCK) {
    await esperar(500);
    return ordenesSimuladas;
  }

  const response = await fetch(`${BASE_URL}/ordenes`);
  if (!response.ok) {
    throw new Error("No se pudieron obtener las órdenes");
  }
  return response.json();
}

export async function obtenerBalance(): Promise<Balance> {
  if (USE_MOCK) {
    await esperar(500);
    return balanceSimulado;
  }

  const response = await fetch(`${BASE_URL}/balance`);
  if (!response.ok) {
    throw new Error("No se pudo obtener el balance");
  }
  return response.json();
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}