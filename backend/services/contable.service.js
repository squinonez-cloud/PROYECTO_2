const pool = require("../config/db");

async function obtenerIdCuenta(codigo) {
  const [filas] = await pool.query("SELECT id FROM plan_cuentas WHERE codigo = ?", [codigo]);
  if (filas.length === 0) {
    throw new Error(`No existe la cuenta con código ${codigo}`);
  }
  return filas[0].id;
}

async function generarAsientoVenta(idOrden, total) {
  const idCaja = await obtenerIdCuenta("1000");
  const idVentas = await obtenerIdCuenta("4000");

  await pool.query(
    "INSERT INTO asientos_contables (id_orden, id_cuenta, tipo_movimiento, monto) VALUES (?, ?, 'cargo', ?)",
    [idOrden, idCaja, total]
  );

  await pool.query(
    "INSERT INTO asientos_contables (id_orden, id_cuenta, tipo_movimiento, monto) VALUES (?, ?, 'abono', ?)",
    [idOrden, idVentas, total]
  );
}

module.exports = { generarAsientoVenta };