'use strict';
module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define('Events', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    communityId: DataTypes.INTEGER,
    online: DataTypes.BOOLEAN,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
    formId: DataTypes.INTEGER,
    prom_rate: DataTypes.FLOAT,
    repositoryId: DataTypes.INTEGER
  }, {});
  Events.associate = function(models) {
    // associations can be defined here
  };
  return Events;
};