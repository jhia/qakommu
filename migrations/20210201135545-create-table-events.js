'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
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
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('c', 'w', 'm') // conference, webinar, meetup
      },
      id_community: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'communities'
          },
          key: 'id'
        }
      },
      online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      no_cfp: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      url_code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_private:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      start: Sequelize.DATE,
      end: Sequelize.DATE,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      prom_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 5.0
      },
      image: {
        type: Sequelize.STRING
      },
      primary_color: Sequelize.STRING,
      secondary_color: Sequelize.STRING,
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
    return queryInterface.dropTable('events')
  }
};
