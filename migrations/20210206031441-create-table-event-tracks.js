'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('event_tracks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
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
    return queryInterface.dropTable('event_tracks');
  }
};
