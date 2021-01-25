'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('memberships', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
      },
      duration: { // in months
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 // a month
      },
      free: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
        field: 'updated_at'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('memberships');
  }
};
