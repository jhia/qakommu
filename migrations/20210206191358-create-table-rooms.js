'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rooms', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: 'events' },
          key: 'id'
        },
        field: 'id_event'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      maxCapacity: {
        field: 'max_capacity',
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isOnline: {
        field: 'is_online',
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      urlClassroom: {
        field: 'url_classroom',
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('rooms');
  }
};
