'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('url_stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url_id: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Urls',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      total_clicks: { 
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_clicked_at: { 
        type: Sequelize.DATE
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
    await queryInterface.dropTable('url_stats');
  }
};
