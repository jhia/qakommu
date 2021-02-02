'use strict'

module.exports = (sequelize, DataTypes) => {
    const channel = sequelize.define('channel', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        id_community: DataTypes.INTEGER,
    });

    channel.associate = function(models){
        channel.hasMany(models.user_channel, {
            foreignKey: 'id_channel',
            as: 'channels'
        });
    }

    return channel;
}