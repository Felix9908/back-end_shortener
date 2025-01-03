'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UrlStat extends Model {
    static associate(models) {
      UrlStat.belongsTo(models.Url, { foreignKey: 'url_id' });
    }
  }

  UrlStat.init({
    url_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Cada URL debe tener una única fila en url_stats
    },
    total_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_earnings: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_clicked_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'UrlStat',
    underscored: false,
  });

  return UrlStat;
};
