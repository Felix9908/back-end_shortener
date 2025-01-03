import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from '../models/index.js'; 
import routes from './Routes/routes.js'; 
import fs from "fs";
import https from "https";  // Importamos el módulo https

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Configuración de certificados SSL
const options = {
  key: fs.readFileSync("./certs/server.key"),  // Ruta al archivo de la clave privada
  cert: fs.readFileSync("./certs/server.cert"),  // Ruta al archivo del certificado
};

// Conexión y sincronización con Sequelize
db.sequelize.authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
    return db.sequelize.sync(); // Sincroniza los modelos con la base de datos
  })
  .then(() => {
    // Carga las rutas desde routes.js
    app.use(routes);

    // Inicia el servidor HTTPS
    https.createServer(options, app).listen(PORT, () => {
      console.log(`El servidor HTTPS está escuchando en https://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1); // Salir con código de error si no hay conexión
  });

export default app;
