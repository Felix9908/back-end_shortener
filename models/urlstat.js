'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UrlStat extends Model {
    static associate(models) {
      UrlStat.belongsTo(models.Url, { foreignKey: 'url_id' });
    }
  }
  UrlStat.init({
    url_id: DataTypes.INTEGER,
    total_clicks: DataTypes.INTEGER,
    last_clicked_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UrlStat',
    underscored: true, 
  });
  return UrlStat;
};
