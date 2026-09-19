require("dotenv").config();
const pool = require("./config/db");

async function probarConexion() {
  try {
    const conexion = await pool.getConnection();
    console.log("Conexión exitosa a TiDB Cloud");

    const [filas] = await conexion.query("SHOW TABLES");
    console.log("Tablas encontradas en la base:", filas);

    conexion.release();
    process.exit(0);
  } catch (error) {
    console.error("Error al conectar:", error.message);
    process.exit(1);
  }
}

probarConexion();
