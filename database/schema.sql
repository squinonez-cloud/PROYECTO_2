CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rol ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sesiones (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    fecha_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_salida DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_sesiones_id_usuario (id_usuario),
    CONSTRAINT fk_sesiones_usuarios
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;