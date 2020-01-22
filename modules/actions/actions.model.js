'use strict'

module.exports = (sequelize, DataTypes) => {
    const actions = sequelize.define('actions', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,

    });

    actions.associate = function(models) {
        // associations can be defined here
        actions.hasMany(models.permissions, {
          foreignKey: 'actId',
          as: 'permissions'
        });
      };
  


    return actions;
}