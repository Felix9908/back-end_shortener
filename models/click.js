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
    url_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    clicked_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Click',
    underscored: false,
  });

  return Click;
};
