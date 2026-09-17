import { useState, FormEvent } from "react";
import { registrar } from "../services/authService";
import "./AuthForms.css";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const respuesta = await registrar({ nombre, email, password });
      if (respuesta.success) {
        alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
        // Aquí después se puede redirigir automáticamente a /login
      } else {
        setError(respuesta.message ?? "No se pudo crear la cuenta");
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
        <h1>Crear cuenta</h1>

        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

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
          minLength={6}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className="auth-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}
