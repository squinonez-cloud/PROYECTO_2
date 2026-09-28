const pool = require("../config/db");

async function obtenerIdCuenta(codigo) {
  const [filas] = await pool.query("SELECT id FROM plan_cuentas WHERE codigo = ?", [codigo]);
  if (filas.length === 0) {
    throw new Error(`No existe la cuenta con código ${codigo}`);
  }
  return filas[0].id;
}

async function registrarMovimiento(idOrden, idCuenta, tipoMovimiento, monto) {
  await pool.query(
    "INSERT INTO asientos_contables (id_orden, id_cuenta, tipo_movimiento, monto) VALUES (?, ?, ?, ?)",
    [idOrden, idCuenta, tipoMovimiento, monto]
  );
}

async function generarAsientoVenta(idOrden, subtotal, iva, total) {
  const idCaja = await obtenerIdCuenta("1000");
  const idVentas = await obtenerIdCuenta("4000");
  const idIva = await obtenerIdCuenta("2000");

  await registrarMovimiento(idOrden, idCaja, "cargo", total);
  await registrarMovimiento(idOrden, idVentas, "abono", subtotal);
  await registrarMovimiento(idOrden, idIva, "abono", iva);

  await pool.query(
    "INSERT INTO impuestos_transacciones (id_orden, tipo_impuesto, monto) VALUES (?, ?, ?)",
    [idOrden, "IVA", iva]
  );
}

module.exports = { generarAsientoVenta };