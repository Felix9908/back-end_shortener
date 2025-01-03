'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GeneralInformation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cpmGeneral: { 
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      mensajeInformativo: { 
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gananciasTotales: { 
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      porcentajeGananciaReferido: { 
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      createdAt: { 
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: { 
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GeneralInformation');
  }
};
