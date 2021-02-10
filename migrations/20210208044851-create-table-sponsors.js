'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sponsors', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.TEXT
      },
      eventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'id_event',
        references: {
          model: { tableName: 'events' },
          key: 'id'
        }
      },
      partnershipId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'id_partnership',
        references: {
          model: { tableName: 'partnerships' },
          key: 'id'
        }
      },
      sponsorTypeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'id_sponsor_type',
        references: {
          model: { tableName: 'sponsor_types' },
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sponsors');
  }
};
