CREATE TABLE IF NOT EXISTS plan_cuentas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(10) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  tipo ENUM('activo', 'pasivo', 'capital', 'ingreso', 'gasto') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_plan_cuentas_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO plan_cuentas (codigo, nombre, tipo) VALUES
('1000', 'Caja', 'activo'),
('1100', 'Cuentas por Cobrar', 'activo'),
('1200', 'Inventario de Vinilos', 'activo'),
('2000', 'IVA por Pagar', 'pasivo'),
('2100', 'Cuentas por Pagar', 'pasivo'),
('3000', 'Capital Social', 'capital'),
('4000', 'Ventas', 'ingreso'),
('5000', 'Costo de Ventas', 'gasto'),
('5100', 'Gastos Operativos', 'gasto');

CREATE TABLE IF NOT EXISTS asientos_contables (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_orden INT UNSIGNED NOT NULL,
  id_cuenta INT UNSIGNED NOT NULL,
  tipo_movimiento ENUM('cargo', 'abono') NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_asientos_id_orden (id_orden),
  KEY idx_asientos_id_cuenta (id_cuenta),
  CONSTRAINT fk_asientos_ordenes
    FOREIGN KEY (id_orden) REFERENCES ordenes (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_asientos_cuentas
    FOREIGN KEY (id_cuenta) REFERENCES plan_cuentas (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
