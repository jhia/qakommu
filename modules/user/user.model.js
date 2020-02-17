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
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    address: DataTypes.STRING,
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail:true
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    },
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
    id_repository: DataTypes.INTEGER,
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

  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.user_type, {
      foreignKey: 'id_user',
      as: 'user_types'
    });
    user.hasMany(models.post, {
      foreignKey: 'id_user',
      as: 'posts'
    });
    
  };
  return user;
};