'use strict'

module.exports = (sequelize, DataTypes) => {
    const track = sequelize.define('track', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        name:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        description:{
            type: DataTypes.TEXT
        },
        active:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        module_name:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    track.associate = function(models){
        track.hasMany(models.track_post, {
            foreignKey: 'id_track',
            as: 'track_posts'
          });
    }

    return track;
}