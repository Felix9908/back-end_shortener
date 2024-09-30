import { shortenUrl } from "../Services/ShortenUrlService.js";
import db from "../../models/index.js";
import { keys } from "../../settings/keys.js";
import jwt from "jsonwebtoken";

const secret_key = keys.key;
const Url = db.Url;
const Click = db.Click;
const UrlStat = db.UrlStat;

import validator from 'validator'; 

export const shorten = async (req, res) => {
  const { originalUrl, description } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Verificar si el token es válido
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, secret_key);
    userId = decoded.userId;
  } catch (err) {
    return res.status(403).json({ error: "Token inválido." });
  }

  // Validaciones
  if (!originalUrl || typeof originalUrl !== 'string' || !validator.isURL(originalUrl)) {
    return res.status(400).json({ error: "URL inválida o faltante." });
  }

  if (description && (typeof description !== 'string' || description.length > 255)) {
    return res.status(400).json({ error: "La descripción es inválida o demasiado larga (máx. 255 caracteres)." });
  }

  if (!userId) {
    return res.status(400).json({ error: "No se pudo obtener el ID de usuario." });
  }

  try {
    const shortenedUrl = await shortenUrl(originalUrl, userId, description);
    return res.json({ shortUrl: `${req.hostname}/${shortenedUrl.shortCode}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al acortar la URL." });
  }
};

// Redireccionar usando el shortCode
// En el controlador:
export const shortCode = async (req, res) => {
  try {
      const shortCode = req.params.shortCode;
      
      const url = await Url.findOne({ where: { shortCode: shortCode } });
      
      if (url) {
          return res.status(200).json({message: "ok", shortCode });
      } else {
          res.status(404).json({ message: "URL not found" });
      }
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};


// Ruta para redirigir después de la publicidad
export const redirectToOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ where: { shortCode: shortCode } });

    if (!url) {
      return res.status(404).json({ error: "URL no encontrada." });
    }

    await Click.create({
      url_id: url.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    });

    // Actualizar estadísticas
    await UrlStat.increment("total_clicks", { where: { url_id: url.id } });
    await UrlStat.update(
      { last_clicked_at: new Date() },
      { where: { url_id: url.id } }
    );

    // Finalmente redirigir a la URL original
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al redirigir a la URL original." });
  }
};


// Obtener todas las URLs acortadas
export const getAllShortenedUrls = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verificar si el userId existe en la petición
    if (!userId) {
      return res.status(400).json({ error: "Falta el ID de usuario." });
    }

    // Buscar todas las URLs acortadas por el usuario
    const urls = await Url.findAll({
      where: { userId: userId },
      include: [
        {
          model: UrlStat, // Incluir estadísticas de la URL
          attributes: ["total_clicks", "last_clicked_at"],
        },
      ],
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creación
    });

    // Verificar si el usuario tiene URLs acortadas
    if (!urls || urls.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron URLs acortadas para este usuario." });
    }

    // Devolver las URLs acortadas con estadísticas
    return res.json(urls);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al obtener las URLs acortadas." });
  }
};

// Eliminar una URL acortada
export const deleteShortenedUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { userId } = req.body;

  try {
    // Verificar si la URL existe y pertenece al usuario
    const url = await Url.findOne({
      where: { shortCode: shortCode, userId: userId },
    });

    if (!url) {
      return res
        .status(404)
        .json({ error: "URL no encontrada o no pertenece al usuario." });
    }

    // Eliminar la URL y sus asociaciones (clics y estadísticas)
    await Click.destroy({ where: { url_id: url.id } }); // Eliminar los clics
    await UrlStat.destroy({ where: { url_id: url.id } }); // Eliminar estadísticas
    await url.destroy(); // Eliminar la URL

    return res.json({ message: "URL eliminada con éxito." });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar la URL." });
  }
};

// Editar una URL acortada
export const editShortenedUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { originalUrl, expiresAt, userId } = req.body;

  // Verificar si los campos requeridos están presentes
  if (!originalUrl || !userId) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    // Verificar si la URL existe y pertenece al usuario
    const url = await Url.findOne({
      where: { shortCode: shortCode, userId: userId },
    });

    if (!url) {
      return res
        .status(404)
        .json({ error: "URL no encontrada o no pertenece al usuario." });
    }

    // Actualizar la URL original y la fecha de expiración (si se proporciona)
    url.originalUrl = originalUrl;
    if (expiresAt) {
      url.expires_at = expiresAt;
    }

    // Guardar los cambios
    await url.save();

    return res.json({ message: "URL editada con éxito.", url });
  } catch (error) {
    return res.status(500).json({ error: "Error al editar la URL." });
  }
};
