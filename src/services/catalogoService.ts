export interface Vinilo {
  id: number;
  titulo: string;
  artista: string;
  precio: number;
  imagen: string;
}

export const obtenerVinilos = async (): Promise<Vinilo[]> => {
  const response = await fetch('http://localhost:4000/api/productos');
  if (!response.ok) {
    throw new Error('No se pudieron obtener los vinilos');
  }
  const data = await response.json();
  return data.map((v: any) => ({ ...v, precio: Number(v.precio) }));
};