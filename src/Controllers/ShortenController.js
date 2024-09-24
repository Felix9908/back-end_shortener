import { shortenUrl } from "../Services/ShortenUrlService";
import { Url, Click, UrlStat } from '../../models';  // Asegúrate de importar los modelos correctos

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
