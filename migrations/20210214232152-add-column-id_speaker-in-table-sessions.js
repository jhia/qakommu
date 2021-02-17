'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sessions', 'id_speaker', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: { tableName: 'users' },
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sessions', 'id_speaker')
  }
};
