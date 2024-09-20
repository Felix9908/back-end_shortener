'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      // Asociación con User
      Url.belongsTo(models.User, { foreignKey: 'user_id' });
      
      // Asociación con Click
      Url.hasMany(models.Click, { foreignKey: 'url_id' });
      
      // Asociación con UrlStat
      Url.hasOne(models.UrlStat, { foreignKey: 'url_id' });
    }
  }
  Url.init({
    original_url: DataTypes.TEXT,
    short_code: DataTypes.STRING,
    expires_at: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Url',
  });
  return Url;
};
