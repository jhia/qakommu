'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('languages', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.DataTypes.NOW
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.DataTypes.NOW
          }
        }, { transaction: t }),
        queryInterface.createTable('countries', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          alphaCode3: { //alphacode3
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            field: 'alpha_code_3'
          },
          phoneCode: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'phone_code'
          },
          languageId: {
            type: Sequelize.DataTypes.INTEGER,
            field: 'id_language',
            references: {
              model: {
                tableName: 'languages'
              },
              key: 'id'
            },
            defaultValue: 1 // must be ENG
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.DataTypes.NOW
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.DataTypes.NOW
          }
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable('countries', { transaction: t }),
        queryInterface.dropTable('languages', { transaction: t })
      ]);
    });
  }
};
