'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('event_team', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      eventId: {
        field: 'id_event',
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'events'
          },
          key: 'id'
        }
      },
      userId: {
        field: 'id_user',
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        }
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    return queryInterface.dropTable('event_team');
  }
};
