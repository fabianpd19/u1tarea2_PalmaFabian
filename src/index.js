const express = require("express");
const { createServer } = require("http");
const realTimeServer = require("./realTimeServer");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const httpServer = createServer(app);

// Configuraciones
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

// Rutas
app.use(require("./routes"));

// Public
app.use(express.static(path.join(__dirname, "public")));

// Iniciar el servidor
httpServer.listen(app.get("port"), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get("port")}`);
});

// Llamo al servidor en tiempo real
realTimeServer(httpServer);

// Ruta 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});
