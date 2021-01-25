'use strict'
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const user_type = sequelize.define('user_type', {
        id_user: DataTypes.INTEGER,
        id_role: DataTypes.INTEGER,
        id_community: DataTypes.INTEGER,
        invitation_code: {
            type: DataTypes.STRING,
            unique: {
                args: true,
                msg: 'Invitation code used!'
              }
        
        },
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
            as: 'users'
        });

        user_type.belongsTo(models.role,{
            foreignKey: 'id_role',
            as: 'roles'
        });


        user_type.belongsTo(models.Community,{
            foreignKey: 'id_community',
            as: 'communities'
        });
 
    }
    
    return user_type;
}