'use strict';
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    description: DataTypes.STRING
  }, {});
  Roles.associate = function(models) {
    // associations can be defined here
    Roles.belongsToMany(models.Users, {
      through: 'UsersRoles',
      foreignKey: 'rolId',
    });

    Roles.belongsToMany(models.Permissions, {
      through: 'PermissionsRoles',
      foreignKey: 'rolId',
      as: 'permissions'
    });
  };
  return Roles;
};