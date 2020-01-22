'use strict'

module.exports = (sequelize, DataTypes) => {
    const resource = sequelize.define('resource', {
        module_name: DataTypes.STRING,
        description: DataTypes.STRING,
      })
  
      resource.associate = function(models) {
        resource.hasMany(models.permission, {
          foreignKey: 'id_resource',
          as: 'permission'
        });
      };
  
    return resource;
}