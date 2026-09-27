import React, { useEffect, useState } from 'react';
import { obtenerVinilos } from '../services/catalogoService';
import type { Vinilo } from '../services/catalogoService';
import { useCarrito } from '../context/CarritoContext';
import './CatalogoPage.css';

export const CatalogoPage: React.FC = () => {
  const [vinilos, setVinilos] = useState<Vinilo[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [agregadoId, setAgregadoId] = useState<number | null>(null);
  const { agregarItem } = useCarrito();

  useEffect(() => {
    obtenerVinilos().then((data) => {
      setVinilos(data);
      setCargando(false);
    });
  }, []);

  function manejarAgregar(v: Vinilo) {
    agregarItem({ id: v.id, titulo: v.titulo, artista: v.artista, precio: v.precio });
    setAgregadoId(v.id);
    setTimeout(() => setAgregadoId(null), 1200);
  }

  if (cargando) {
    return (
      <div className="catalogo-container">
        <h2 className="catalogo-titulo">Cargando catálogo...</h2>
      </div>
    );
  }

  return (
    <div className="catalogo-container">
      <h1 className="catalogo-titulo">Catálogo de Vinilos</h1>
      <div className="catalogo-grid">
        {vinilos.map((v) => (
          <div key={v.id} className="vinilo-card">
            <img src={v.imagen} alt={v.titulo} className="vinilo-imagen" />
            <div className="vinilo-info">
              <h3 className="vinilo-titulo">{v.titulo}</h3>
              <p className="vinilo-artista">{v.artista}</p>
              <span className="vinilo-precio">${v.precio.toFixed(2)}</span>
              <button
                className={agregadoId === v.id ? "vinilo-agregar vinilo-agregado" : "vinilo-agregar"}
                onClick={() => manejarAgregar(v)}
              >
                {agregadoId === v.id ? "✓ Agregado" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CatalogoPage;