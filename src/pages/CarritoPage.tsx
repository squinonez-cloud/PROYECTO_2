import { useState } from "react";
import { itemsSimulados } from "../services/carritoService";
import type { ItemCarrito } from "../services/carritoService";
import "./CarritoPage.css";

export default function CarritoPage() {
  const [items, setItems] = useState<ItemCarrito[]>(itemsSimulados);

  function aumentarCantidad(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  }

  function disminuirCantidad(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.cantidad > 0
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  }

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  function confirmarCompra() {
    alert(`Total de la compra: Q${total.toFixed(2)}`);
  }

  return (
    <div className="carrito-container">
      <h1>Tu carrito</h1>

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
                  <button onClick={() => disminuirCantidad(item.id)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => aumentarCantidad(item.id)}>+</button>
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

      <button className="carrito-confirmar" onClick={confirmarCompra}>
        Confirmar compra
      </button>
    </div>
  );
}