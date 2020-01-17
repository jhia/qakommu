'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Permissions = sequelize.define('Permissions', {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
/* 
      validate: {
        isEmail:true
      },
 */      
      unique: {
          args: true,
          msg: 'Description already in use!'
      }
    }
  });

  Permissions.associate = function(models) {
    // associations can be defined here
    Permissions.hasMany(models.Roles,{
      foreignKey: "perId",
      as: "Roles"
    });

    Permissions.belongsTo(models.Permissions, {
      through: 'Permissions',
      foreignKey: 'id',
      as: 'Permissions'
    });

  };




  return Permissions;
};