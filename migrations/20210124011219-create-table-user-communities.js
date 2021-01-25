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
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
        field: 'updated_at'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_communities');
  }
};
