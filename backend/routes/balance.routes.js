const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/balance", async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT pc.codigo AS codigo,
              pc.nombre AS cuenta,
              pc.tipo AS tipo,
              COALESCE(SUM(CASE WHEN a.tipo_movimiento = 'cargo' THEN a.monto ELSE 0 END), 0) AS totalCargos,
              COALESCE(SUM(CASE WHEN a.tipo_movimiento = 'abono' THEN a.monto ELSE 0 END), 0) AS totalAbonos
       FROM plan_cuentas pc
       LEFT JOIN asientos_contables a ON a.id_cuenta = pc.id
       GROUP BY pc.id, pc.codigo, pc.nombre, pc.tipo
       ORDER BY pc.codigo`
    );

    const totalCargosGeneral = filas.reduce((suma, fila) => suma + Number(fila.totalCargos), 0);
    const totalAbonosGeneral = filas.reduce((suma, fila) => suma + Number(fila.totalAbonos), 0);
    const cuadra = totalCargosGeneral === totalAbonosGeneral;

    res.json({
      cuentas: filas,
      totalCargos: totalCargosGeneral,
      totalAbonos: totalAbonosGeneral,
      cuadra,
    });
  } catch (error) {
    console.error("Error en /balance:", error);
    res.status(500).json({ success: false, message: "Error al obtener el balance" });
  }
});

module.exports = router;