const { Url } = require('../models');
const crypto = require('crypto');

const generateShortCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

export const shortenUrl = async (originalUrl, userId, expiresAt = null) => {
  let shortCode;
  let urlExists = true;

  // Generar un código corto único
  while (urlExists) {
    shortCode = generateShortCode();
    urlExists = await Url.findOne({ where: { short_code: shortCode } });
  }

  // Guardar la URL en la base de datos
  const newUrl = await Url.create({
    original_url: originalUrl,
    short_code: shortCode,
    user_id: userId,
    expires_at: expiresAt,
  });

  return newUrl;
};
