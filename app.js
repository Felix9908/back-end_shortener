const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());
const keys = require("./settings/keys");
const secret_key = keys.key;

// Configuración de la base de datos
const db = mysql.createPool({
  host: "sql9.freemysqlhosting.net",
  user: "sql9648511",
  password: "CaTi7kel3Y",
  database: "sql9648511",
});

async function checkDatabaseConnection() {
  try {
    await db.execute("SELECT 1");
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Salir con código de error si no hay conexión
  }
}

// Ruta para generar un enlace aleatorio
app.post("/generar-enlace", async (req, res) => {
  const originalUrl = req.body.url;

  // Generar código aleatorio para el enlace
  const enlaceCodigo = Math.random().toString(36).substr(2, 6);

  // Guardar el enlace en la base de datos
  try {
    const [result] = await db.execute(
      "INSERT INTO enlaces (codigo, url_original) VALUES (?, ?)",
      [enlaceCodigo, originalUrl]
    );
    res.json({ success: true, enlaceCodigo });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al generar el enlace." });
  }
});

// Ruta para el inicio de sesión
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE user = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      const payload = {
        check: true,
        data: rows,
      };
      jwt.sign(payload, "secret_key", (err, token) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send({
            msg: "AUTEMTICACION EXITOSA",
            token: token,
            userData: rows,
          });
        }
      });
    } else {
      // Credenciales incorrectas
      res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});

//Ruta para crear cuenta
app.post("/createAccount", async (req, res) => {
  const {
    user,
    password,
    email,
    privUser,
    formadepago,
    direccionParticular,
    telephoneNumber,
    ciudad,
    npmbreCompleto,
    estado,
    pais,
  } = req.body;

  if (!user || !password || !email || !privUser) {
    res.status(400).send("No se recibieron todos los datos requeridos.");
    return;
  }

  const sql =
    "INSERT INTO usuarios (user, password, priv, formadepago, direccionParticular, correo, telephoneNumber, ciudad, nombreCompleto, estado, pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values = [
    user,
    password,
    privUser,
    formadepago || null, // Agregar valores predeterminados si son null
    direccionParticular || null,
    email,
    telephoneNumber || null,
    ciudad || null,
    npmbreCompleto || null,
    estado || null,
    pais || null,
  ];

  try {
    await db.execute(sql, values);
    res.status(200).send("Usuario registrado exitosamente");
  } catch (error) {
    console.error("Error al insertar datos en la tabla SQL:", error);
    res.status(500).send("Error al insertar datos en la tabla SQL");
  }
});
// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
