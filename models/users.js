'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    gender: DataTypes.STRING,
    repositoryId: DataTypes.INTEGER,
    last_login: DataTypes.DATE
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
    Users.belongsToMany(models.Roles, {
      through: 'UsersRoles',
      foreignKey: 'userId',
      as: 'roles'
    });
  };
  return Users;
};