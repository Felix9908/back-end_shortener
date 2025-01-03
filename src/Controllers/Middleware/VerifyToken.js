import jwt from "jsonwebtoken";
import { keys } from "../../../settings/keys.js";

const secret_key = keys.key;

export const verifyToken = (req, res, next) => {
  // Obtén el token desde el encabezado Authorization o desde cookies
  const authHeader = req.headers["authorization"];
  const token = authHeader
    ? authHeader.split(" ")[1]
    : req.cookies?.auth_token;

  // Si no hay token, envía un mensaje de error
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. No se proporcionó un token.",
    });
  }

  // Verifica el token
  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token inválido o expirado.",
      });
    }

    // Adjunta el usuario decodificado al objeto `req` y continúa
    req.user = decoded;
    next();
  });
};
