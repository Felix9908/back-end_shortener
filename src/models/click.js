'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Click extends Model {
    static associate(models) {
      // Asociación con Url
      Click.belongsTo(models.Url, { foreignKey: 'url_id' });
      
      // Asociación con User
      Click.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Click.init({
    url_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    clicked_at: DataTypes.DATE,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Click',
  });
  return Click;
};
