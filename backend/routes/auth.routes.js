const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const USE_MOCK = true;

const usuariosMock = [];
const sesionesMock = [];
let siguienteIdUsuario = 1;
let siguienteIdSesion = 1;

router.post("/registro", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
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

  try {
    if (USE_MOCK) {
      const usuario = usuariosMock.find((u) => u.email === email);
      if (!usuario) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" });
      }

      const coincide = await bcrypt.compare(password, usuario.passwordHash);
      if (!coincide) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" });
      }

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