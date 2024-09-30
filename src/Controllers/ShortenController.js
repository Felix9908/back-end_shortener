import { shortenUrl } from "../Services/ShortenUrlService.js";
import db from "../../models/index.js";
import { keys } from "../../settings/keys.js";
import jwt from "jsonwebtoken";
import validator from 'validator'; 

const { Url, Click, UrlStat } = db;
const secret_key = keys.key;

// Acortar URL
export const shorten = async (req, res) => {
  const { originalUrl, description, newsType, domain } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado." });

  try {
    const { userId } = jwt.verify(token, secret_key);

    // Validaciones
    if (!validator.isURL(originalUrl) || !newsType || !domain || (description && description.length > 255)) {
      return res.status(400).json({ error: "Datos inválidos." });
    }

    const shortenedUrl = await shortenUrl(originalUrl, userId, description, newsType, domain);
    return res.json({ shortUrl: `${req.hostname}/${shortenedUrl.shortCode}` });
  } catch (err) {
    return res.status(403).json({ error: "Token inválido." });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ where: { shortCode: req.params.shortCode } });

    if (!url) return res.status(404).json({ error: "URL no encontrada." });

    await Click.create({
      url_id: url.id,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    });

    await UrlStat.increment("total_clicks", { where: { url_id: url.id } });
    await UrlStat.update({ last_clicked_at: new Date() }, { where: { url_id: url.id } });

    return res.status(200).json({ originalUrl: url.originalUrl });
  } catch (error) {
    return res.status(500).json({ error: "Error al procesar la redirección." });
  }
};

// Eliminar una URL acortada
export const deleteShortenedUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { userId } = req.body;

  try {
    const url = await Url.findOne({ where: { shortCode, userId } });

    if (!url) return res.status(404).json({ error: "URL no encontrada o no pertenece al usuario." });

    await Click.destroy({ where: { url_id: url.id } });
    await UrlStat.destroy({ where: { url_id: url.id } });
    await url.destroy();

    return res.json({ message: "URL eliminada con éxito." });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar la URL." });
  }
};

// Obtener todas las URLs acortadas
export const getAllShortenedUrls = async (req, res) => {
  const { userId } = req.params;

  try {
    const urls = await Url.findAll({
      where: { userId },
      include: [{ model: UrlStat, attributes: ["total_clicks", "last_clicked_at"] }],
      order: [["createdAt", "DESC"]],
    });

    if (!urls.length) return res.status(404).json({ error: "No se encontraron URLs acortadas para este usuario." });

    return res.json(urls);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener las URLs acortadas." });
  }
};

// Editar una URL acortada
export const editShortenedUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { originalUrl, expiresAt, userId } = req.body;

  if (!originalUrl || !userId) return res.status(400).json({ error: "Faltan campos requeridos." });

  try {
    const url = await Url.findOne({ where: { shortCode, userId } });

    if (!url) return res.status(404).json({ error: "URL no encontrada o no pertenece al usuario." });

    url.originalUrl = originalUrl;
    if (expiresAt) url.expires_at = expiresAt;
    await url.save();

    return res.json({ message: "URL editada con éxito.", url });
  } catch (error) {
    return res.status(500).json({ error: "Error al editar la URL." });
  }
};
