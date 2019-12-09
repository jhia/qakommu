'use strict';
module.exports = (sequelize, DataTypes) => {
  const inputs = sequelize.define('inputs', {
    label: DataTypes.STRING,
    placeholder: DataTypes.STRING,
    type: DataTypes.STRING,
    params: DataTypes.JSON,
    formId: DataTypes.INTEGER
  }, {});
  inputs.associate = function(models) {
    // associations can be defined here
  };
  return inputs;
};
