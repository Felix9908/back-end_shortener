import url from '../../models/url.js';
import crypto from 'crypto'

// Genera un código corto único (hexadecimal)
const generateShortCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

// Servicio para acortar URL
export const shortenUrl = async (originalUrl, userId, expiresAt = null) => {
  let shortCode;
  let urlExists = true;

  // Generar un código corto único
  while (urlExists) {
    shortCode = generateShortCode();
    urlExists = await url.findOne({ where: { short_code: shortCode } });
  }

  // Guardar la URL acortada en la base de datos
  const shortenedUrl = await url.create({
    original_url: originalUrl,
    short_code: shortCode,
    user_id: userId,
    expires_at: expiresAt,
  });

  return shortenedUrl;
};