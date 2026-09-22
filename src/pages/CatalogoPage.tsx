import React, { useEffect, useState } from 'react';
import { Vinilo, obtenerVinilos } from '../services/catalogoService';
import './CatalogoPage.css';

export const CatalogoPage: React.FC = () => {
  const [vinilos, setVinilos] = useState<Vinilo[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    obtenerVinilos().then((data) => {
      setVinilos(data);
      setCargando(false);
    });
  }, []);

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};