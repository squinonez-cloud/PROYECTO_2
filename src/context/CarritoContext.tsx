import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ItemCarrito {
  id: number;
  titulo: string;
  artista: string;
  precio: number;
  cantidad: number;
}

interface CarritoContextType {
  items: ItemCarrito[];
  agregarItem: (item: Omit<ItemCarrito, 'cantidad'>) => void;
  quitarItem: (id: number) => void;
  cambiarCantidad: (id: number, cantidad: number) => void;
  vaciarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemCarrito[]>(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarItem = (item: Omit<ItemCarrito, 'cantidad'>) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === item.id);
      if (existente) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const quitarItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cambiarCantidad = (id: number, cantidad: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad } : i))
        .filter((i) => i.cantidad > 0)
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
    localStorage.removeItem('carrito');
  };

  return (
    <CarritoContext.Provider value={{ items, agregarItem, quitarItem, cambiarCantidad, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
};