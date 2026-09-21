import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { usuario, idSesion, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!idSesion) {
      logout();
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idSesion }),
      });
      const data = await res.json();

      if (data.success) {
        logout();
        navigate('/login');
      }
    } catch (err) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
      <h1>Bienvenido, {usuario?.nombre || 'Usuario'}</h1>
      <button 
        onClick={handleLogout}
        style={{
          padding: '0.8rem 1.5rem',
          backgroundColor: '#ff0055',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};