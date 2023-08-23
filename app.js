const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'tu_contraseña',
  database: 'acortador_db'
});

// Ruta para generar un enlace aleatorio
app.post('/generar-enlace', async (req, res) => {
  const originalUrl = req.body.url;

  // Generar código aleatorio para el enlace
  const enlaceCodigo = Math.random().toString(36).substr(2, 6);

  // Guardar el enlace en la base de datos
  try {
    const [result] = await db.execute(
      'INSERT INTO enlaces (codigo, url_original) VALUES (?, ?)',
      [enlaceCodigo, originalUrl]
    );
    res.json({ success: true, enlaceCodigo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al generar el enlace.' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
