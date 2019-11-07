'use strict';
module.exports = (sequelize, DataTypes) => {
  const Themes = sequelize.define('Themes', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    requested: DataTypes.BOOLEAN
  }, {});
  Themes.associate = function(models) {
    // associations can be defined here
  };
  return Themes;
};