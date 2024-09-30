import jwt from "jsonwebtoken";
import { keys } from "../../../settings/keys.js";

const secret_key = keys.key;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(403);
  jwt.verify(token, secret_key, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
