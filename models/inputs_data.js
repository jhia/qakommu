'use strict';
module.exports = (sequelize, DataTypes) => {
  const inputs_data = sequelize.define('inputs_data', {
    inputId: DataTypes.INTEGER,
    speakerId: DataTypes.INTEGER,
    data: DataTypes.STRING
  }, {});
  inputs_data.associate = function(models) {
    // associations can be defined here
  };
  return inputs_data;
};
