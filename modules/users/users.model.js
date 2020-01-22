'use strict';
const _ = require('lodash');
const bcrypt = require('bcrypt');

function encrypt_password(password){
  const saltRounds = 10;
  const newPassword = password || 'admin';
  return bcrypt.hashSync(newPassword, saltRounds);
}

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    active: {
      type: Sequelize.BOOLEAN,
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
  users.associate = function(models) {
    // associations can be defined here
    users.hasMany(models.user_type, {
      foreignKey: 'userId',
      as: 'user_type'
    });

  };
  return users;
};