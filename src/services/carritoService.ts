export interface ItemCarrito {
  id: number;
  titulo: string;
  precio: number;
  cantidad: number;
}

export const itemsSimulados: ItemCarrito[] = [
  { id: 1, titulo: "Rumours - Fleetwood Mac", precio: 350, cantidad: 1 },
  { id: 2, titulo: "Thriller - Michael Jackson", precio: 420, cantidad: 2 },
  { id: 3, titulo: "Abbey Road - The Beatles", precio: 480, cantidad: 1 },
];