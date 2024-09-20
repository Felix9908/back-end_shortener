import express from "express";
import cors from "cors";
import db from './models/index.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Conexión y sincronización con Sequelize
db.sequelize.authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
    return db.sequelize.sync(); // Sincroniza los modelos con la base de datos
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`El servidor está escuchando en el puerto: ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1); // Salir con código de error si no hay conexión
  });

export default app;
