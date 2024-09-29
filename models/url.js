'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      Url.belongsTo(models.User, { foreignKey: 'userId' });
      Url.hasMany(models.Click, { foreignKey: 'urlId' });
      Url.hasOne(models.UrlStat, { foreignKey: 'urlId' });
    }
  }
  Url.init({
    originalUrl: DataTypes.TEXT,
    shortCode: DataTypes.STRING,
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Url',
  });
  return Url;
};
