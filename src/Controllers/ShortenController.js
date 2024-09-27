import { shortenUrl } from "../Services/ShortenUrlService.js";
import Url from '../../models/url.js';
import Click from '../../models/click.js';
import UrlStat from '../../models/UrlStat.js';

// Acortar URL
export const shorten = async (req, res) => {
  const { originalUrl, userId, expiresAt } = req.body;

  if (!originalUrl || !userId) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  try {
    const shortenedUrl = await shortenUrl(originalUrl, userId, expiresAt);
    return res.json({ shortUrl: `${req.hostname}/${shortenedUrl.short_code}` });
  } catch (error) {
    return res.status(500).json({ error: 'Error al acortar la URL.' });
  }
};

// Redireccionar usando el shortCode
export const shortCode = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ where: { short_code: shortCode } });

    if (!url) {
      return res.status(404).json({ error: 'URL no encontrada.' });
    }

    // Registrar clic
    await Click.create({
      url_id: url.id,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      user_id: req.user?.id || null,  // si existe userId
    });

    // Actualizar estadísticas
    await UrlStat.increment('total_clicks', { where: { url_id: url.id } });
    await UrlStat.update({ last_clicked_at: new Date() }, { where: { url_id: url.id } });

    return res.redirect(url.original_url);
  } catch (error) {
    return res.status(500).json({ error: 'Error al redirigir la URL.' });
  }
};

// Obtener todas las URLs acortadas
export const getAllShortenedUrls = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verificar si el userId existe en la petición
    if (!userId) {
      return res.status(400).json({ error: 'Falta el ID de usuario.' });
    }

    // Buscar todas las URLs acortadas por el usuario
    const urls = await Url.findAll({
      where: { user_id: userId },
      include: [{
        model: UrlStat,  // Incluir estadísticas de la URL
        attributes: ['total_clicks', 'last_clicked_at'],
      }],
      order: [['createdAt', 'DESC']],  // Ordenar por fecha de creación
    });

    // Verificar si el usuario tiene URLs acortadas
    if (!urls || urls.length === 0) {
      return res.status(404).json({ error: 'No se encontraron URLs acortadas para este usuario.' });
    }

    // Devolver las URLs acortadas con estadísticas
    return res.json(urls);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las URLs acortadas.' });
  }
};

// Eliminar una URL acortada
export const deleteShortenedUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { userId } = req.body;

  try {
    // Verificar si la URL existe y pertenece al usuario
    const url = await Url.findOne({ where: { short_code: shortCode, user_id: userId } });

    if (!url) {
      return res.status(404).json({ error: 'URL no encontrada o no pertenece al usuario.' });
    }

    // Eliminar la URL y sus asociaciones (clics y estadísticas)
    await Click.destroy({ where: { url_id: url.id } });  // Eliminar los clics
    await UrlStat.destroy({ where: { url_id: url.id } });  // Eliminar estadísticas
    await url.destroy();  // Eliminar la URL

    return res.json({ message: 'URL eliminada con éxito.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar la URL.' });
  }
};

// Editar una URL acortada
export const editShortenedUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { originalUrl, expiresAt, userId } = req.body;

  // Verificar si los campos requeridos están presentes
  if (!originalUrl || !userId) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  try {
    // Verificar si la URL existe y pertenece al usuario
    const url = await Url.findOne({ where: { short_code: shortCode, user_id: userId } });

    if (!url) {
      return res.status(404).json({ error: 'URL no encontrada o no pertenece al usuario.' });
    }

    // Actualizar la URL original y la fecha de expiración (si se proporciona)
    url.original_url = originalUrl;
    if (expiresAt) {
      url.expires_at = expiresAt;
    }

    // Guardar los cambios
    await url.save();

    return res.json({ message: 'URL editada con éxito.', url });
  } catch (error) {
    return res.status(500).json({ error: 'Error al editar la URL.' });
  }
};
