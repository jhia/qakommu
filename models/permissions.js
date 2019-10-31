'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permissions = sequelize.define('Permissions', {
    description: DataTypes.STRING,
    resId: DataTypes.INTEGER,
  }, {});
  Permissions.associate = function(models) {
    // associations can be defined here
    Permissions.belongsToMany(models.Roles, {
      through: 'PermissionsRoles',
      foreignKey: 'perId',
      as: 'permissions'
    });

    Permissions.belongsTo(models.Resources, {
      as: 'resource',
      foreignKey:'resId'
    });
  };
  return Permissions;
};