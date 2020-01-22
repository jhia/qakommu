'use strict';
module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define('permission', {
  });
  permission.associate = function(models) {
    // associations can be defined here
    permission.belongsTo(models.rol, {
      as: 'rol',
      foreignKey: 'id_rol',
    });

    permission.belongsTo(models.resource, {
      as: 'resource',
      foreignKey:'id_resource'
    });

    permission.belongsTo(models.action, {
      as: 'action',
      foreignKey:'id_action'
    });
    
  };
  return permission;
};