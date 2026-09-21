export interface Vinilo {
  id: number;
  titulo: string;
  artista: string;
  precio: number;
  imagen: string;
}

const VINILOS_MOCK: Vinilo[] = [
  {
    id: 1,
    titulo: 'The Dark Side of the Moon',
    artista: 'Pink Floyd',
    precio: 35.00,
    imagen: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500&q=80'
  },
  {
    id: 2,
    titulo: 'Abbey Road',
    artista: 'The Beatles',
    precio: 30.00,
    imagen: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500&q=80'
  },
  {
    id: 3,
    titulo: 'Random Access Memories',
    artista: 'Daft Punk',
    precio: 42.50,
    imagen: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80'
  },
  {
    id: 4,
    titulo: 'Thriller',
    artista: 'Michael Jackson',
    precio: 28.00,
    imagen: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80'
  },
  {
    id: 5,
    titulo: 'Rumours',
    artista: 'Fleetwood Mac',
    precio: 32.00,
    imagen: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80'
  }
];

export const obtenerVinilos = async (): Promise<Vinilo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return VINILOS_MOCK;
};