'use strict'

module.exports = (sequelize, DataTypes) => {
    const rol = sequelize.define('rol', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
              msg: 'Rol exist'
          }
      },
        description: DataTypes.STRING,
    });

    rol.associate = function(models) {
       rol.hasOne(models.user_type, {
        foreignKey: 'id_rol',
        as: 'user_type'
      });
    }

    
    rol.associate = function(models) {
      rol.hasMany(models.permission, {
       foreignKey: 'id_rol',
       as: 'permission'
     });
   }
    return rol;
}