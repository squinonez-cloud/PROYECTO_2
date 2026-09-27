import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./CarritoPage.css";

export default function CarritoPage() {
  const { items, cambiarCantidad, vaciarCarrito } = useCarrito();
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const { usuario } = useAuth();

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  async function confirmarCompra() {
    if (!usuario) {
      setError("Debes iniciar sesión para completar la compra");
      return;
    }
    if (items.length === 0) {
      setError("El carrito está vacío");
      return;
    }
    if (!numeroTarjeta.trim()) {
      setError("Ingresa un número de tarjeta");
      return;
    }

    setError("");
    setEnviando(true);

    try {
      const respuesta = await fetch("http://localhost:4000/api/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: usuario.id,
          numeroTarjeta,
          items: items.map((item) => ({ id: item.id, cantidad: item.cantidad })),
        }),
      }).then((res) => res.json());

      if (respuesta.success) {
        alert(`Compra confirmada. Total: Q${respuesta.total.toFixed(2)}`);
        vaciarCarrito();
        setNumeroTarjeta("");
      } else {
        setError(respuesta.message || "No se pudo procesar la compra");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
    <Navbar />
    <div className="carrito-container">
      <h1>Tu carrito</h1>

      {error && <p className="carrito-error">{error}</p>}

      <table className="carrito-tabla">
        <thead>
          <tr>
            <th>Título</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.titulo}</td>
              <td>Q{item.precio.toFixed(2)}</td>
              <td>
                <div className="carrito-cantidad">
                  <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
                </div>
              </td>
              <td>Q{(item.precio * item.cantidad).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="carrito-total">
        <span>Total: Q{total.toFixed(2)}</span>
      </div>

      <input
        type="text"
        placeholder="Número de tarjeta"
        value={numeroTarjeta}
        onChange={(e) => setNumeroTarjeta(e.target.value)}
        className="carrito-input-tarjeta"
      />

      <button className="carrito-confirmar" onClick={confirmarCompra} disabled={enviando}>
        {enviando ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
    </>
  );
}