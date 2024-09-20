import { shortenUrl } from "../Services/ShortenUrlService";

export const shorten = async (req, res) => {
    const { originalUrl, userId, expiresAt } = req.body;
  
    if (!originalUrl || !userId) {
      return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }
  
    try {
      const newUrl = await shortenUrl(originalUrl, userId, expiresAt);
      res.json({ shortUrl: `${req.hostname}/${newUrl.short_code}` });
    } catch (error) {
      res.status(500).json({ error: 'Error al acortar la URL.' });
    }
  };

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
      });
  
      // Actualizar estadísticas
      await UrlStat.increment('total_clicks', { where: { url_id: url.id } });
      await UrlStat.update({ last_clicked_at: new Date() }, { where: { url_id: url.id } });
  
      res.redirect(url.original_url);
    } catch (error) {
      res.status(500).json({ error: 'Error al redirigir la URL.' });
    }
  };
  