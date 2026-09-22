const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const router = express.Router();

const intentosLogin = {};
const LIMITE_INTENTOS = 5;
const VENTANA_BLOQUEO_MS = 5 * 60 * 1000;

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/registro", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
  }

  if (!emailValido(email)) {
    return res.status(400).json({ success: false, message: "El correo no tiene un formato válido" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    const [existentes] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existentes.length > 0) {
      return res.status(409).json({ success: false, message: "Ese correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)",
      [nombre, email, passwordHash]
    );

    return res.json({
      success: true,
      usuario: { id: resultado.insertId, nombre, email },
    });
  } catch (error) {
    console.error("Error en /registro:", error);
    res.status(500).json({ success: false, message: "Error al registrar usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
  }

  const ahora = Date.now();
  const registro = intentosLogin[email];

  if (registro && registro.bloqueadoHasta && ahora < registro.bloqueadoHasta) {
    const segundosRestantes = Math.ceil((registro.bloqueadoHasta - ahora) / 1000);
    return res.status(429).json({
      success: false,
      message: `Demasiados intentos fallidos. Intenta de nuevo en ${segundosRestantes} segundos`,
    });
  }

  try {
    const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const usuario = usuarios[0];
    const coincide = usuario ? await bcrypt.compare(password, usuario.password_hash) : false;

    if (!usuario || !coincide) {
      const previo = intentosLogin[email] || { intentos: 0 };
      const intentos = previo.intentos + 1;

      intentosLogin[email] = {
        intentos,
        bloqueadoHasta: intentos >= LIMITE_INTENTOS ? ahora + VENTANA_BLOQUEO_MS : null,
      };

      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    delete intentosLogin[email];

    const [resultadoSesion] = await pool.query(
      "INSERT INTO sesiones (id_usuario) VALUES (?)",
      [usuario.id]
    );

    return res.json({
      success: true,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      idSesion: resultadoSesion.insertId,
    });
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ success: false, message: "Error al iniciar sesión" });
  }
});

router.post("/logout", async (req, res) => {
  const { idSesion } = req.body;

  if (!idSesion) {
    return res.status(400).json({ success: false, message: "Falta el id de la sesión" });
  }

  try {
    await pool.query("UPDATE sesiones SET fecha_salida = NOW() WHERE id = ?", [idSesion]);
    return res.json({ success: true });
  } catch (error) {
    console.error("Error en /logout:", error);
    res.status(500).json({ success: false, message: "Error al cerrar sesión" });
  }
});

module.exports = router;