'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    description: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  });


  Roles.associate = function(models) {
    // associations can be defined here
    Roles.hasOne(models.Users,{
      foreignKey: "rolId",
      as: "Users"
    });

    Roles.belongsTo(models.Permissions, {
      through: 'Permissions',
      foreignKey: 'id',
      as: 'Permissions'
    });

  };





  return Roles;
};