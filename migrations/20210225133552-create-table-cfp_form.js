'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cfp_forms', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      formId: {
        field: 'id_form',
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'forms' },
          key: 'id'
        }
      },
      isTemplate: {
        field: 'is_template',
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdBy: {
        field: 'created_by',
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users'
          },
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cfp_forms');
  }
};
