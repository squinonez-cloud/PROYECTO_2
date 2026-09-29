const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { generarAsientoVenta } = require("../services/contable.service");

function esTarjetaValida(numero) {
  const digitos = numero.replace(/\D/g, "").split("").reverse().map(Number);
  const suma = digitos.reduce((acc, d, i) => {
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    return acc + d;
  }, 0);
  return digitos.length >= 13 && suma % 10 === 0;
}

function esVencimientoValido(vencimiento) {
  const coincide = /^(\d{2})\/(\d{2})$/.exec(vencimiento || "");
  if (!coincide) return false;
  const mes = Number(coincide[1]);
  const anio = 2000 + Number(coincide[2]);
  if (mes < 1 || mes > 12) return false;
  const ahora = new Date();
  const finDeMes = new Date(anio, mes, 0, 23, 59, 59);
  return finDeMes >= ahora;
}

function esCvvValido(cvv) {
  return /^\d{3,4}$/.test(cvv || "");
}

router.post("/ordenes", async (req, res) => {
  try {
    const { idUsuario, numeroTarjeta, vencimientoTarjeta, cvvTarjeta, items } = req.body;

    if (!idUsuario || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El idUsuario y un arreglo de items no vacío son obligatorios."
      });
    }

    if (!numeroTarjeta || !esTarjetaValida(numeroTarjeta)) {
      return res.status(400).json({
        success: false,
        message: "Número de tarjeta inválido"
      });
    }

    if (!esVencimientoValido(vencimientoTarjeta)) {
      return res.status(400).json({
        success: false,
        message: "Fecha de vencimiento inválida o tarjeta vencida"
      });
    }

    if (!esCvvValido(cvvTarjeta)) {
      return res.status(400).json({
        success: false,
        message: "CVV inválido"
      });
    }

    let subtotalCentavos = 0;

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

      subtotalCentavos += Math.round(Number(rows[0].precio) * 100) * item.cantidad;
    }

    const ivaCentavos = Math.round(subtotalCentavos * 0.12);
    const totalCentavos = subtotalCentavos + ivaCentavos;

    const subtotal = subtotalCentavos / 100;
    const iva = ivaCentavos / 100;
    const total = totalCentavos / 100;

    const [resultado] = await pool.query(
      "INSERT INTO ordenes (id_usuario, total, estado) VALUES (?, ?, ?)",
      [idUsuario, total, "pendiente"]
    );

    await generarAsientoVenta(resultado.insertId, subtotal, iva, total);

    return res.status(201).json({
      success: true,
      idOrden: resultado.insertId,
      subtotal: subtotal,
      iva: iva,
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