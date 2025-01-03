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
        unique: true, // Cada URL tiene una única entrada en url_stats
        references: {
          model: 'Urls',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      total_views: { 
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_earnings: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
