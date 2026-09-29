import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./CarritoPage.css";

export default function CarritoPage() {
  const { items, cambiarCantidad, vaciarCarrito } = useCarrito();
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [vencimientoTarjeta, setVencimientoTarjeta] = useState("");
  const [cvvTarjeta, setCvvTarjeta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = Math.round(total * 12) / 100;
  const totalConIva = total + iva;

  async function confirmarCompra() {
    if (!usuario) {
      setError("Debes iniciar sesión para completar la compra");
      return;
    }
    if (items.length === 0) {
      setError("El carrito está vacío");
      return;
    }
    if (!numeroTarjeta.trim() || !vencimientoTarjeta.trim() || !cvvTarjeta.trim()) {
      setError("Completa todos los datos de la tarjeta");
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
          vencimientoTarjeta,
          cvvTarjeta,
          items: items.map((item) => ({ id: item.id, cantidad: item.cantidad })),
        }),
      }).then((res) => res.json());

      if (respuesta.success) {
        const itemsFactura = items.map((item) => ({
          id: item.id,
          titulo: item.titulo,
          precio: item.precio,
          cantidad: item.cantidad,
        }));

        vaciarCarrito();
        setNumeroTarjeta("");
        setVencimientoTarjeta("");
        setCvvTarjeta("");

        navigate("/factura", {
          state: {
            idOrden: respuesta.idOrden,
            fecha: new Date().toLocaleString(),
            usuario: usuario.nombre,
            items: itemsFactura,
            subtotal: respuesta.subtotal,
            iva: respuesta.iva,
            total: respuesta.total,
          },
        });
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
          <div>Subtotal: Q{total.toFixed(2)}</div>
          <div>IVA (12%): Q{iva.toFixed(2)}</div>
          <div>Total: Q{totalConIva.toFixed(2)}</div>
        </div>

        <input
          type="text"
          placeholder="Número de tarjeta"
          value={numeroTarjeta}
          onChange={(e) => setNumeroTarjeta(e.target.value)}
          className="carrito-input-tarjeta"
        />
        <div className="carrito-tarjeta-detalles">
          <input
            type="text"
            placeholder="MM/AA"
            maxLength={5}
            value={vencimientoTarjeta}
            onChange={(e) => setVencimientoTarjeta(e.target.value)}
            className="carrito-input-tarjeta"
          />
          <input
            type="text"
            placeholder="CVV"
            maxLength={4}
            value={cvvTarjeta}
            onChange={(e) => setCvvTarjeta(e.target.value)}
            className="carrito-input-tarjeta"
          />
        </div>

        <button className="carrito-confirmar" onClick={confirmarCompra} disabled={enviando}>
          {enviando ? "Procesando..." : "Confirmar compra"}
        </button>
      </div>
    </>
  );
}