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
      return res
        .status(401)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas." });
    }

    // Genera el token JWT
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
        // Establece el token en una cookie HTTP-only
        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: true, // Cambiar a true en producción si usas HTTPS
          sameSite: "none", // Configuración para navegación cruzada
          maxAge: 30 * 24 * 60 * 60 * 1000, // Tiempo de vida de la cookie
        });

        res.status(200).json({
          success: true,
          msg: "AUTENTICACIÓN EXITOSA",
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
  // Verifica si la cookie está presente
  const authCookie = req.cookies?.auth_token;

  if (!authCookie) {
    return res.status(401).json({ msg: "No se encontró cookie de autenticación" });
  }

  try {
    // Borra la cookie desde el cliente
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/", 
    });
    

    res.status(200).json({ msg: "Has sido desconectado y la cookie ha sido eliminada" });
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    res.status(500).json({ msg: "Error al cerrar sesión" });
  }
};

export const authcheck = (req, res) => {
  const token = req.cookies.auth_token;

  console.log("este es el toeken: ", token)

  if (!token) {
    return res.json({ success: false });
  }

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      return res.json({ success: false });
    }

    return res.json({ success: true });
  });
}
