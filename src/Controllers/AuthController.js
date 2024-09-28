import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../../models/index.js";
import { keys } from "../../settings/keys.js";

const secret_key = keys.key;
const User = db.User;

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca el usuario por nombre de usuario en la base de datos
    const user = await User.findOne({ where: { username } });

    if (!user) {
      // Si el usuario no existe
      return res
        .status(401)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      // Si las contraseñas no coinciden
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas." });
    }

    // Genera el token JWT e incluye el tipo de usuario (admin o worker)
    const payload = {
      check: true,
      userId: user.id,
      username: user.username,
      email: user.email,
      userType: user.user_type,
    };

    jwt.sign(payload, secret_key, { expiresIn: "30d" }, (err, token) => {
      if (err) {
        res
          .status(500)
          .json({ success: false, message: "Error al generar el token." });
      } else {
        res.status(200).json({
          success: true,
          msg: "AUTENTICACIÓN EXITOSA",
          token,
          userData: {
            username: user.username,
            email: user.email,
            userType: user.user_type,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
};

export const logOut = (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .send({ msg: "No se proporcionó token de autenticación" });
  }

  // Extraemos el token del encabezado "Bearer token"
  const token = authHeader.split(" ")[1];

  // Cambiamos la expiración del token a 1 segundo
  jwt.sign({ token }, secret_key, { expiresIn: "1s" }, (err, newToken) => {
    if (err) {
      res.status(500).send({ msg: "Error al cerrar sesión" });
    } else {
      res.status(200).send({
        msg: "Has sido desconectado",
      });
    }
  });
};
