'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('event_tracks', {
      id,
      trackId: {
        field: 'id_track',
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'tracks'
          },
          key: 'id'
        },
      },
      eventId: {
        field: 'id_event',
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'events'
          },
          key: 'id'
        },
      },
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('event_tracks');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
