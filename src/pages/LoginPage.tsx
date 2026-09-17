import { useState, FormEvent } from "react";
import { login } from "../services/authService";
import "./AuthForms.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const respuesta = await login({ email, password });
      if (respuesta.success) {
        // Aquí luego se puede guardar el usuario en un contexto global
        // o redirigir a la página principal de la tienda.
        console.log("Sesión iniciada:", respuesta.usuario);
        alert(`Bienvenido, ${respuesta.usuario?.nombre}`);
      } else {
        setError(respuesta.message ?? "No se pudo iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={manejarEnvio}>
        <h1>Iniciar sesión</h1>

        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="auth-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
}
