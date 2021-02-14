'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ticket_sales', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_ticket: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'tickets' },
          key: 'id'
        }
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'users' },
          key: 'id'
        }
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      unit_amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      total_amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      total_amount_paid: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      price_type: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ticket_sales');
  }
};
