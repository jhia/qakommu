'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('forms', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      template: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'default'
      },
      options: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '{}'
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
    return queryInterface.dropTable('forms');
  }
};
