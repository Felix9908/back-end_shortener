import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../models/index.js";
import { keys } from "../../settings/keys.js";

const secret_key = keys.key;
const User = db.User;

export const createAccount = async (req, res) => {
  const { user, password, email } = req.body;

  if (!user || !password || !email) {
    return res
      .status(400)
      .send("Nombre de usuario, correo y contraseña son obligatorios.");
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await User.create({
      username: user,
      password_hash: hashedPassword,
      email,
      is_active: true,
      user_type: "worker",
      createdAt: new Date(),
    });

    res.status(200).send("Usuario registrado exitosamente");
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).send("Error al registrar el usuario");
  }
};

export const updateUserDetails = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const {
    withdrawal_method,
    withdrawal_account,
    address1,
    address2,
    mobile,
    city,
    full_name,
    state,
    country,
  } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token no proporcionado." });
  }

  try {
    // Verificar y decodificar el token para obtener el userId
    const decoded = jwt.verify(token, secret_key);
    const userId = decoded.userId;

    // Buscar el usuario por su ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Actualizar solo los campos proporcionados
    await user.update({
      withdrawal_method: withdrawal_method || user.withdrawal_method,
      withdrawal_account: withdrawal_account || user.withdrawal_account,
      address1: address1 || user.address1,
      address2: address2 || user.address2,
      mobile: mobile || user.mobile,
      city: city || user.city,
      full_name: full_name || user.last_name,
      state: state || user.state,
      country: country || user.country,
      updatedAt: new Date(),
    });

    res.status(200).send("Datos del usuario actualizados correctamente");
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    res.status(500).send("Error al actualizar los datos del usuario");
  }
};

// Función para cambiar el estado activo del usuario (solo admins)
export const toggleUserActiveStatus = async (req, res) => {
  const { token } = req.headers;
  const { newStatus } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token no proporcionado." });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, secret_key);
    const userType = decoded.user_type;
    const userId = decoded.userId;

    // Comprobamos si el usuario es administrador
    if (userType !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Acceso denegado. Solo los administradores pueden realizar esta acción.",
        });
    }

    // Buscamos el usuario al que se le va a cambiar el estado
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    user.is_active = newStatus;
    try {
      await user.save();
    } catch (error) {
      console.error("Error al guardar los cambios en la base de datos:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error al guardar los cambios en la base de datos.",
        });
    }
    return res.status(200).json({
      success: true,
      message: `El usuario ha sido ${
        newStatus ? "activado" : "desactivado"
      } exitosamente.`,
      user: {
        id: user.id,
        username: user.username,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error en el servidor." });
  }
};

export const deleteUser = async (req, res) => {
  const { token } = req.headers;
  const { userId } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token no proporcionado." });
  }

  try {
    // Verificar y decodificar el token para asegurarnos de que el usuario tenga permisos
    const decoded = jwt.verify(token, secret_key);
    const userType = decoded.user_type;

    // Comprobamos si el usuario es administrador o si es el mismo usuario el que se va a eliminar
    if (userType !== "admin" && decoded.userId !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Acceso denegado. No tienes permisos para eliminar este usuario.",
        });
    }

    // Buscar el usuario por su ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    // Eliminar el usuario
    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente.",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al eliminar el usuario." });
  }
};
