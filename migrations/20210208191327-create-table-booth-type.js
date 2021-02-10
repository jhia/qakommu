'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('booth_types', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cost: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      sizeWidth: {
        field: 'size_width',
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sizeHeight: {
        field: 'size_height',
        type: Sequelize.INTEGER,
        allowNull: false
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
    return queryInterface.dropTable('booth_types');
  }
};
