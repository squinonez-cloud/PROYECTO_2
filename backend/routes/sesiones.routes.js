const express = require("express");
const router = express.Router();

const usuariosSimulados = [
  { id: 1, nombre: "Carlos Pérez" },
  { id: 2, nombre: "Ana Gómez" }
];

const sesionesSimuladas = [
  { id: 1, usuarioId: 1, fechaEntrada: "2026-09-17 09:10", fechaSalida: null },
  { id: 2, usuarioId: 2, fechaEntrada: "2026-09-17 10:00", fechaSalida: "2026-09-17 11:30" }
];

router.get("/sesiones", (req, res) => {
  const respuesta = sesionesSimuladas.map((sesion) => {
    const usuarioEncontrado = usuariosSimulados.find((u) => u.id === sesion.usuarioId);
    return {
      id: sesion.id,
      usuario: usuarioEncontrado ? usuarioEncontrado.nombre : "Usuario Desconocido",
      fechaEntrada: sesion.fechaEntrada,
      fechaSalida: sesion.fechaSalida,
    };
  });
  res.json(respuesta);
});

module.exports = router;