'use strict'

module.exports = (sequelize, DataTypes) => {
    const resources = sequelize.define('resources', {
      description: DataTypes.STRING,
      module_name: DataTypes.STRING,
    })

    resources.associate = function(models) {
      // associations can be defined here
      resources.hasMany(models.permissions, {
        foreignKey: 'resId',
        as: 'permissions'
      });
    };

    return resources
}
