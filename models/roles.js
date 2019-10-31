'use strict';
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    userId: DataTypes.INTEGER,
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
    });
  };
  return Roles;
};