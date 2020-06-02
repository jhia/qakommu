'use strict'

module.exports = (sequelize, DataTypes) => {
    const message = sequelize.define('message', {
        message: DataTypes.TEXT
    });

    message.associate = function(models){

        
        message.hasOne(models.user_channel, {
            foreignKey: 'id_message',
            as: 'messages'
          });








    }

    return message;
}