'use strict'

module.exports = (sequelize, DataTypes) => {
    const action = sequelize.define('action', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,

    });

    action.associate = function(models) {
        // associations can be defined here
        action.hasMany(models.permission, {
          foreignKey: 'id_action',
          as: 'permission'
        });
      };
  


    return action;
}