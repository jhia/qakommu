'use strict'

module.exports = (sequelize, DataTypes) => {
    const action = sequelize.define('action', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
              msg: 'Action exist'
          }
        },
        description: DataTypes.STRING,
    });

    action.associate = function(models) {
        // associations can be defined here
        action.hasMany(models.permission, {
          foreignKey: 'id_action',
          as: 'permissions'
        });
      };
    return action;
}