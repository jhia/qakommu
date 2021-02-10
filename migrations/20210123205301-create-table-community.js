'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('communities', {
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
        defaultValue: true,
        allowNull: false,
      },
      prefix: {
        type: Sequelize.STRING,
      },
      // member needs verification
      memberVerification: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'member_verification'
      },
      code: { // share code
        type: Sequelize.STRING,
        allowNull: false
      },
      isPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'is_private'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('communities');
  }
};
