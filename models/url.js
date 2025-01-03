'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      Url.belongsTo(models.User, { foreignKey: 'userId' });
      Url.hasMany(models.Click, { foreignKey: 'urlId' });
      Url.hasOne(models.UrlStat, { foreignKey: 'url_id' });
    }
  }

  Url.init({
    originalUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    newsType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'userId',
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Url',
    tableName: 'urls',
    underscored: false,
  });

  return Url;
};
