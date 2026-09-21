import React, { useState } from 'react';

interface WelcomePageProps {
  onLogoutSuccess?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onLogoutSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    const idSesion = localStorage.getItem('idSesion');

    try {
      if (idSesion) {
        // Petición al endpoint POST /api/logout enviando el idSesion
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idSesion }),
        });
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError('Ocurrió un error al intentar cerrar sesión.');
    } finally {
      // Limpiar los datos guardados de la sesión
      localStorage.removeItem('idSesion');
      localStorage.removeItem('userToken');
      setLoading(false);

      // Redirigir de vuelta al Login
      if (onLogoutSuccess) {
        onLogoutSuccess();
      } else {
        window.location.href = '/login';
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Lado Izquierdo: Diseño de vinilo rotatorio a la mitad */}
      <div className="dashboard-left">
        <div className="vinyl-hero" />
        <h2>VINYL STORE</h2>
        <p>Sesión activa • Seguimiento de auditoría</p>
      </div>

      {/* Lado Derecho: Panel de Bienvenida y Logout */}
      <div className="dashboard-right">
        <div className="auth-form">
          <h1>¡Bienvenido! 🎧</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Has iniciado sesión exitosamente en el sistema.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <button onClick={handleLogout} disabled={loading}>
            {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

