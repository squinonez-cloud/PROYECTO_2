import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        padding: "1rem 1.5rem",
        background: "rgba(10, 8, 18, 0.85)",
        borderBottom: "1px solid rgba(255, 0, 127, 0.3)",
        color: "#f4f4f9"
      }}
    >
      <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
        <Link to="/dashboard" style={{ color: "#f4f4f9", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/catalogo" style={{ color: "#f4f4f9", textDecoration: "none" }}>Catálogo</Link>
        <Link to="/historial" style={{ color: "#f4f4f9", textDecoration: "none" }}>Historial</Link>
        <Link to="/carrito" style={{ color: "#f4f4f9", textDecoration: "none" }}>Carrito</Link>
        {usuario?.rol === "admin" && (
          <Link to="/admin" style={{ color: "#f4f4f9", textDecoration: "none" }}>Admin</Link>
        )}
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#ff0055",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Cerrar sesión
      </button>
    </nav>
  );
}