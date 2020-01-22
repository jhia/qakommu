'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissions = sequelize.define('permissions', {
  });
  permissions.associate = function(models) {
    // associations can be defined here
    permissions.belongsTo(models.roles, {
      as: 'roles',
      foreignKey: 'rolId',
    });

    permissions.belongsTo(models.resources, {
      as: 'resource',
      foreignKey:'resId'
    });

    permissions.belongsTo(models.actions, {
      as: 'actions',
      foreignKey:'actId'
    });
    
  };
  return permissions;
};