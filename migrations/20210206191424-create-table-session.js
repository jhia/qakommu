'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sessions', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      roomId: {
        field: 'id_room',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'rooms' },
          key: 'id'
        }
      },
      eventId: {
        field: 'id_event',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'events' },
          key: 'id'
        }
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      questionTime: {
        field: 'question_time',
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      hasBreak: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'has_break'
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
    return queryInterface.dropTable('sessions');
  }
};
