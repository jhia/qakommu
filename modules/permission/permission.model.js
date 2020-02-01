'use strict';

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define('permission', {
    id_role: Sequelize.INTEGER,
    id_resource: Sequelize.INTEGER,
    _create: Sequelize.BOOLEAN,
    _read: Sequelize.BOOLEAN,
    _update: Sequelize.BOOLEAN,
    _delete: Sequelize.BOOLEAN,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  });
  permission.associate = function(models) {
    permission.belongsTo(models.role, {
      as: 'roles',
      foreignKey: 'id_role',
    });

    permission.belongsTo(models.resource, {
      as: 'resources',
      foreignKey:'id_resource'
    });    
  };
  return permission;
};