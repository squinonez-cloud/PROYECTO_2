SELECT
  s.id AS id,
  u.nombre AS usuario,
  DATE_FORMAT(s.fecha_entrada, '%Y-%m-%d %H:%i') AS fechaEntrada,
  DATE_FORMAT(s.fecha_salida, '%Y-%m-%d %H:%i') AS fechaSalida
FROM sesiones s
JOIN usuarios u ON s.usuario_id = u.id;
