'use strict'
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const user_type = sequelize.define('user_type', {
        id_user: DataTypes.INTEGER,
        id_rol: DataTypes.INTEGER,
        id_community: DataTypes.INTEGER,
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          }
    });

    user_type.associate = function(models){
        user_type.belongsTo(models.user,{
            foreignKey: 'id_user',
            as: 'user'
        });

        user_type.belongsTo(models.rol,{
            foreignKey: 'id_rol',
            as: 'rol'
        });


        user_type.belongsTo(models.community,{
            foreignKey: 'id_community',
            as: 'community'
        });
 
    }
    
    return user_type;
}