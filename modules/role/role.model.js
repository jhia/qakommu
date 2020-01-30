'use strict'

module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('role', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
              msg: 'role exist'
          }
      },
        description: DataTypes.STRING,
    });

    role.associate = function(models) {
       role.hasOne(models.user_type, {
        foreignKey: 'id_role',
        as: 'user_types'
      });
    }

    
    role.associate = function(models) {
      role.hasMany(models.permission, {
       foreignKey: 'id_role',
       as: 'permissions'
     });
   }
    return role;
}