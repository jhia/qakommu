'use strict';
module.exports = (sequelize, DataTypes) => {
  const Resources = sequelize.define('Resources', {
    description: DataTypes.STRING,
    module_name: DataTypes.STRING,
    action: DataTypes.STRING
  }, {});
  Resources.associate = function(models) {
    // associations can be defined here
    Resources.hasOne(models.Permissions, {
      foreignKey: 'resId',
      as: 'permissions'
    });
  };
  return Resources;
};