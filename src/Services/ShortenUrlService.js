import db from "../../models/index.js";
import crypto from 'crypto';

// Genera un código corto único (hexadecimal)
const generateShortCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

// Servicio para acortar URL
export const shortenUrl = async (originalUrl, userId, description = null) => {
  const url = db.Url;

  // Comprobar si la URL ya fue acortada por este usuario
  const existingUrl = await url.findOne({ where: { originalUrl: originalUrl, userId: userId } });
  if (existingUrl) {
    return existingUrl; // Si ya existe, la devolvemos directamente
  }

  // Generar un código corto único
  let shortCode;
  let urlExists = true;
  while (urlExists) {
    shortCode = generateShortCode();
    urlExists = await url.findOne({ where: { shortCode: shortCode } });
  }

  // Guardar la URL acortada en la base de datos
  const shortenedUrl = await url.create({
    originalUrl: originalUrl,
    shortCode: shortCode,
    userId: userId,
    description: description,
  });

  return shortenedUrl;
};
