'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sponsor_types', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      contributionValue: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        field: 'contribution_value'
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      displayNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'display_number'
      },
      communityId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'id_community'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sponsor_types');
  }
};
