'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('memberships', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: { tableName: 'users' },
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('memberships', 'created_by')
  }
};
