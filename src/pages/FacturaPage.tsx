import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./FacturaPage.css";

interface ItemFactura {
  id: number;
  titulo: string;
  precio: number;
  cantidad: number;
}

interface DatosFactura {
  idOrden: number;
  fecha: string;
  usuario: string;
  items: ItemFactura[];
  subtotal: number;
  iva: number;
  total: number;
}

export default function FacturaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const datos = location.state as DatosFactura | undefined;

  if (!datos) {
    return (
      <>
        <Navbar />
        <div className="factura-container">
          <p>No hay una factura reciente para mostrar.</p>
          <button onClick={() => navigate("/catalogo")}>Volver al catálogo</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="factura-solo-pantalla">
        <Navbar />
      </div>
      <div className="factura-container">
        <div className="factura-encabezado">
          <h1>Factura de compra</h1>
          <p>Proyecto Vinilos — Grupo 2</p>
        </div>

        <div className="factura-datos">
          <p><strong>Orden:</strong> #{datos.idOrden}</p>
          <p><strong>Fecha:</strong> {datos.fecha}</p>
          <p><strong>Cliente:</strong> {datos.usuario}</p>
        </div>

        <table className="factura-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {datos.items.map((item) => (
              <tr key={item.id}>
                <td>{item.titulo}</td>
                <td>{item.cantidad}</td>
                <td>Q{item.precio.toFixed(2)}</td>
                <td>Q{(item.precio * item.cantidad).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="factura-totales">
          <p>Subtotal: Q{datos.subtotal.toFixed(2)}</p>
          <p>IVA (12%): Q{datos.iva.toFixed(2)}</p>
          <p className="factura-total-final">Total: Q{datos.total.toFixed(2)}</p>
        </div>

        <div className="factura-solo-pantalla factura-acciones">
          <button onClick={() => window.print()}>Imprimir / Guardar como PDF</button>
          <button onClick={() => navigate("/catalogo")}>Volver al catálogo</button>
        </div>
      </div>
    </>
  );
}