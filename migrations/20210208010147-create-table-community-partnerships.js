'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('community_partnerships', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      communityId: {
        field: 'id_community',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'communities' },
          key: 'id'
        }
      },
      partnershipId: {
        field: 'id_partnership',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'partnerships' },
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
    return queryInterface.dropTable('community_partnerships');
  }
};
