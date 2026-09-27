import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginRequest } from '../services/authService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const respuesta = await loginRequest({ email, password });

      if (respuesta.success && respuesta.usuario && respuesta.idSesion) {
        login(respuesta.usuario, respuesta.idSesion);
        navigate('/dashboard');
      } else {
        setError(respuesta.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-input-wrapper">
          <input
            type={mostrarPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setMostrarPassword(!mostrarPassword)}
          >
            {mostrarPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button type="submit">Entrar</button>
        <p className="auth-link">
        ¿No tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </form>
    </div>
  );
};
export default LoginPage;