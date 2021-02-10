'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('session_tracks', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sessionId: {
        field: 'id_session',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'sessions' },
          key: 'id'
        }
      },
      trackId: {
        field: 'id_track',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'tracks' },
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
    return queryInterface.dropTable('session_tracks');
  }
};
