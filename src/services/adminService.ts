const BASE_URL = "http://localhost:4000/api";

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

export async function obtenerOrdenes(): Promise<Orden[]> {
  const response = await fetch(`${BASE_URL}/ordenes`);
  if (!response.ok) {
    throw new Error("No se pudieron obtener las órdenes");
  }
  const data = await response.json();
  return data.map((o: any) => ({ ...o, total: Number(o.total) }));
}

export async function obtenerBalance(): Promise<Balance> {
  const response = await fetch(`${BASE_URL}/balance`);
  if (!response.ok) {
    throw new Error("No se pudo obtener el balance");
  }
  const data = await response.json();
  return {
    ...data,
    totalCargos: Number(data.totalCargos),
    totalAbonos: Number(data.totalAbonos),
    cuentas: data.cuentas.map((c: any) => ({
      ...c,
      totalCargos: Number(c.totalCargos),
      totalAbonos: Number(c.totalAbonos),
    })),
  };
}