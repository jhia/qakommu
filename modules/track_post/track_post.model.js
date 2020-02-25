'use strict'

module.exports = (sequelize, DataTypes) => {
    const track_post = sequelize.define('track_post', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		}
    });

    track_post.associate = function(models){

        track_post.belongsTo(models.post,{
            foreignKey: 'id_post',
            as: 'posts'
        });

        track_post.belongsTo(models.track,{
            foreignKey: 'id_track',
            as: 'tracks'
        });
    }

    return track_post;
}