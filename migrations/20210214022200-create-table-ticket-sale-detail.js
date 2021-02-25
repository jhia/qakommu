'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ticket_sale_details', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      id_ticket_sale: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'ticket_sales' },
          key: 'id'
        }
      },
      deactivated: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
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
    return queryInterface.dropTable('ticket_sale_details');
  }
};
