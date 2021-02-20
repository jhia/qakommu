'use strict'

module.exports = (sequelize, DataTypes) => {
  const object_type = sequelize.define('object_type', {

    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,       

  });

  object_type.associate = function(models){
    //To create model associations
  }

  return object_type;
}
