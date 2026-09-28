import { useEffect, useState } from "react";
import { obtenerOrdenes, obtenerBalance } from "../services/adminService";
import type { Orden, Balance } from "../services/adminService";
import Navbar from "../components/Navbar";
import "./AdminPage.css";

export default function AdminPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const datosOrdenes = await obtenerOrdenes();
        const datosBalance = await obtenerBalance();
        setOrdenes(datosOrdenes);
        setBalance(datosBalance);
      } catch (err) {
        setError("No se pudieron cargar los datos del panel");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <>
        <Navbar />
        <div className="admin-container">
          <p>Cargando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1>Panel de administración</h1>

        {error && <p className="admin-balance-error">{error}</p>}

        <section className="admin-seccion">
          <h2>Órdenes</h2>
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.usuario}</td>
                  <td>Q{orden.total.toFixed(2)}</td>
                  <td>{orden.estado}</td>
                  <td>{orden.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-seccion">
          <h2>Balance contable</h2>
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cuenta</th>
                <th>Tipo</th>
                <th>Total cargos</th>
                <th>Total abonos</th>
              </tr>
            </thead>
            <tbody>
              {balance?.cuentas.map((cuenta) => (
                <tr key={cuenta.codigo}>
                  <td>{cuenta.codigo}</td>
                  <td>{cuenta.cuenta}</td>
                  <td>{cuenta.tipo}</td>
                  <td>Q{cuenta.totalCargos.toFixed(2)}</td>
                  <td>Q{cuenta.totalAbonos.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {balance &&
            (balance.cuadra ? (
              <p className="admin-balance-ok">Balance cuadrado</p>
            ) : (
              <p className="admin-balance-error">Balance descuadrado</p>
            ))}
        </section>
      </div>
    </>
  );
}