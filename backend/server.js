require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const sesionesRoutes = require("./routes/sesiones.routes");
const productosRoutes = require("./routes/productos.routes");
const balanceRoutes = require("./routes/balance.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API del proyecto de vinilos funcionando correctamente" });
});

app.use("/api", authRoutes);
app.use("/api", sesionesRoutes);
app.use("/api", productosRoutes);
app.use("/api", balanceRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});