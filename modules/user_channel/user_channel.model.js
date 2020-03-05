'use strict'

module.exports = (sequelize, DataTypes) => {
    const user_channel = sequelize.define('user_channel', {

    });

    user_channel.associate = function(models){

        user_channel.belongsTo(models.channel,{
            foreignKey: 'id_channel',
            as: 'channels'
        });

        user_channel.belongsTo(models.user,{
            foreignKey: 'id_user',
            as: 'users'
        });



    }

    return user_channel;
}