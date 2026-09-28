const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/productos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, titulo, artista, precio, imagen FROM vinilos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener los productos" });
  }
});

module.exports = router;