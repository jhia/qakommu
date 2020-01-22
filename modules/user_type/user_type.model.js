'use strict'

module.exports = (sequelize, DataTypes) => {
    const user_type = sequelize.define('user_type', {
    });


    user_type.associate = function(models){

        user_type.belongsTo(models.users,{
            as: 'users',
            foreignKey: 'userId'
        });

        
        user_type.belongsTo(models.roles,{
            as: 'rolId',
            foreignKey: 'roles'
        });
        user_type.belongsTo(models.communities,{
            as: 'communityId',
            foreignKey: 'communities'
        });
    }
    
    return user_type;
}