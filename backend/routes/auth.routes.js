const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const USE_MOCK = true;

const usuariosMock = [];
const sesionesMock = [];
let siguienteIdUsuario = 1;
let siguienteIdSesion = 1;

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
    const passwordHash = await bcrypt.hash(password, 10);

    if (USE_MOCK) {
      const existe = usuariosMock.find((u) => u.email === email);
      if (existe) {
        return res.status(409).json({ success: false, message: "Ese correo ya está registrado" });
      }

      const nuevoUsuario = { id: siguienteIdUsuario++, nombre, email, passwordHash };
      usuariosMock.push(nuevoUsuario);

      return res.json({
        success: true,
        usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email },
      });
    }
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
    if (USE_MOCK) {
      const usuario = usuariosMock.find((u) => u.email === email);
      const coincide = usuario ? await bcrypt.compare(password, usuario.passwordHash) : false;

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

      const nuevaSesion = {
        id: siguienteIdSesion++,
        idUsuario: usuario.id,
        fechaEntrada: new Date().toISOString(),
        fechaSalida: null,
      };
      sesionesMock.push(nuevaSesion);

      return res.json({
        success: true,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
        idSesion: nuevaSesion.id,
      });
    }
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
    if (USE_MOCK) {
      const sesion = sesionesMock.find((s) => s.id === idSesion);
      if (sesion) {
        sesion.fechaSalida = new Date().toISOString();
      }
      return res.json({ success: true });
    }
  } catch (error) {
    console.error("Error en /logout:", error);
    res.status(500).json({ success: false, message: "Error al cerrar sesión" });
  }
});

module.exports = router;