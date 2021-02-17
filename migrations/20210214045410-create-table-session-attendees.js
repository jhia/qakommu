'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('session_attendees', {
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
      userId: {
        field: 'id_attendee',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'attendees' },
          key: 'id'
        }
      },
      rate: Sequelize.FLOAT,
      comment: Sequelize.TEXT,
      isPresent: {
        field: 'is_present',
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    return queryInterface.dropTable('session_attendees');
  }
};
