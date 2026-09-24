const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { generarAsientoVenta } = require("../services/contable.service");

router.post("/ordenes", async (req, res) => {
  try {
    const { idUsuario, items } = req.body;

    if (!idUsuario || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El idUsuario y un arreglo de items no vacío son obligatorios."
      });
    }

    let total = 0;

    for (const item of items) {
      if (!item.id || !item.cantidad || item.cantidad <= 0) {
        return res.status(400).json({
          success: false,
          message: "Cada item debe incluir un id válido y una cantidad mayor a 0."
        });
      }

      const [rows] = await pool.query("SELECT precio FROM vinilos WHERE id = ?", [item.id]);

      if (rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `El vinilo con id ${item.id} no existe.`
        });
      }

      total += rows[0].precio * item.cantidad;
    }

    const [resultado] = await pool.query(
      "INSERT INTO ordenes (id_usuario, total, estado) VALUES (?, ?, ?)",
      [idUsuario, total, "pendiente"]
    );

    await generarAsientoVenta(resultado.insertId, total);

    return res.status(201).json({
      success: true,
      idOrden: resultado.insertId,
      total: total
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al procesar la orden.",
      error: error.message
    });
  }
});

router.get("/ordenes", async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT o.id AS id,
              u.nombre AS usuario,
              o.total AS total,
              o.estado AS estado,
              DATE_FORMAT(o.fecha, '%Y-%m-%d %H:%i') AS fecha
       FROM ordenes o
       JOIN usuarios u ON o.id_usuario = u.id
       ORDER BY o.fecha DESC`
    );

    res.json(filas);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener las órdenes" });
  }
});

module.exports = router;