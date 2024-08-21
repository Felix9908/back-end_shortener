import jwt from "jsonwebtoken";
import keys from "../../settings/keys.js";

const secret_key = keys.key;

export const login = async (req, res) => {
  const { username, password } = req.body;

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
      jwt.sign(payload, secret_key, (err, token) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send({
            msg: "AUTENTICACIÓN EXITOSA",
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
};

export const logOut = (req, res) => {
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, secret_key, { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "Has sido desconectado" });
    } else {
      res.send({ msg: "Error" });
    }
  });
};
