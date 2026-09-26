CREATE TABLE IF NOT EXISTS impuestos_transacciones (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_orden INT UNSIGNED NOT NULL,
    tipo_impuesto VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_impuestos_id_orden (id_orden),
    CONSTRAINT fk_impuestos_ordenes
        FOREIGN KEY (id_orden) REFERENCES ordenes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
