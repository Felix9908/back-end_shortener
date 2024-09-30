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
    newsType: DataTypes.STRING,  
    domain: DataTypes.STRING,    
    userId: {
      type: DataTypes.INTEGER,
      field: 'userId'  
    }
  }, {
    sequelize,
    modelName: 'Url',
    tableName: 'urls',
    underscored: false,
  });
  return Url;
};
