'use strict';

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define('permission', {
    id_action: Sequelize.INTEGER,
    id_rol: Sequelize.INTEGER,
    id_resource: Sequelize.INTEGER,
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
    // associations can be defined here
    permission.belongsTo(models.rol, {
      as: 'rols',
      foreignKey: 'id_rol',
    });

    permission.belongsTo(models.resource, {
      as: 'resources',
      foreignKey:'id_resource'
    });

    permission.belongsTo(models.action, {
      as: 'actions',
      foreignKey:'id_action'
    });
    
  };
  return permission;
};