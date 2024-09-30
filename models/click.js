'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Click extends Model {
    static associate(models) {
      Click.belongsTo(models.Url, { foreignKey: 'url_id' });
      Click.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Click.init({
    url_id: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    clicked_at: DataTypes.DATE,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Click',
    underscored: false, 
  });
  return Click;
};
