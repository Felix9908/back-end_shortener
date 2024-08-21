import { db } from "../app";

export const createAccount = async (req, res) => {
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
      formadepago || null, 
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
  };