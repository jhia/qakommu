'use strict';
const _ = require('lodash');
const bcrypt = require('bcrypt');

function encrypt_password(password){
  const saltRounds = 10;
  const newPassword = password || 'admin';
  return bcrypt.hashSync(newPassword, saltRounds);
}

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: true
    },
    gender: DataTypes.STRING,
    repositoryId: DataTypes.INTEGER,
    last_login: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: function (admin) {
        admin.password = encrypt_password(admin.password);
      },
      beforeUpdate(admin) {
        //admin.password = encrypt_password(admin.password);
      }
    }
  });

  //const setupAgentModel = require('../models/')
  Users.associate = function(models) {
    // associations can be defined here
    Users.belongsToMany(models.Roles, {
      through: 'UsersRoles',
      foreignKey: 'userId',
      as: 'roles'
    });

    Users.belongsToMany(models.Communities, {
      through: 'UsersCommunities',
      foreignKey: 'userId',
      as: 'communities'
    });

  };
  return Users;
};