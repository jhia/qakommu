'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('form_items', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.TEXT,
      },
      content: {
        type: Sequelize.TEXT
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isInput: {
        field: 'is_input',
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      disabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    return queryInterface.dropTable('form_items');
  }
};
