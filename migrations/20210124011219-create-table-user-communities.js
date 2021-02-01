'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_communities', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        field: 'id_user',
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        allowNull: false
      },
      communityId: {
        field: 'id_community',
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'communities'
          },
          key: 'id'
        },
        allowNull: false
      },
      membershipId: { // default is basic
        field: 'id_membership',
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'memberships'
          },
          key: 'id'
        },
        defaultValue: 1
      },
      approved: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true
      },
      approvedBy: { //only for private communities
        field: 'id_approved_by',
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        allowNull: true
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
    return queryInterface.dropTable('user_communities');
  }
};
