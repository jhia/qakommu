'use strict';
module.exports = (sequelize, DataTypes) => {
  const forms = sequelize.define('forms', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  forms.associate = function(models) {
    // associations can be defined here
  };
  return forms;
};