'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class GeneralInformation extends Model {
    static associate(models) {
      // Define asociaciones si las hay
    }
  }

  GeneralInformation.init({
    cpmGeneral: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mensajeInformativo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gananciasTotales: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    porcentajeGananciaReferido: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'GeneralInformation',
    underscored: false, 
  });

  return GeneralInformation;
};
