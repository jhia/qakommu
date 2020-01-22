'use strict'

module.exports = (sequelize, DataTypes) => {
    const roles = sequelize.define('roles', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
              msg: 'Name exist'
          }
      },
        description: DataTypes.STRING,
    });

    roles.associate = function(models) {
       roles.hasMany(models.permissions, {
        foreignKey: 'rolId',
        as: 'permissions'
      });
    }
      
    return roles;
}