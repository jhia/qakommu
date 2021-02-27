'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('input_data', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      formId: {
        field: 'id_form',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'forms' },
          key: 'id'
        }
      },
      formItemId: {
        field: 'id_form_item',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'form_items' },
          key: 'id'
        }
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false
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
    return queryInterface.dropTable('input_data');
  }
};
