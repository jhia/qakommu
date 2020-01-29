'use strict'

module.exports = (sequelize, DataTypes) => {
    const resource = sequelize.define('resource', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Module exist!'
        }
      },
      url_resource: DataTypes.STRING
    })
  
      resource.associate = function(models) {
        resource.hasMany(models.permission, {
          foreignKey: 'id_resource',
          as: 'permissions'
        });
      };
  
    return resource;
}