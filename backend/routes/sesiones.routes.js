const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/sesiones", async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT s.id AS id,
              u.nombre AS usuario,
              DATE_FORMAT(s.fecha_entrada, '%Y-%m-%d %H:%i') AS fechaEntrada,
              DATE_FORMAT(s.fecha_salida, '%Y-%m-%d %H:%i') AS fechaSalida
       FROM sesiones s
       JOIN usuarios u ON s.id_usuario = u.id
       ORDER BY s.fecha_entrada DESC`
    );

    res.json(filas);
  } catch (error) {
    console.error("Error en /sesiones:", error);
    res.status(500).json({ success: false, message: "Error al obtener el historial" });
  }
});

module.exports = router;