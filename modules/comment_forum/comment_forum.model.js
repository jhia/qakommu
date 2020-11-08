'use strict'

module.exports = (sequelize, DataTypes) => {
    const comment_forum = sequelize.define('comment_forum', {

	id_topic: DataTypes.INTEGER,
	id_user: DataTypes.INTEGER,
	name: DataTypes.TEXT,
	description: DataTypes.TEXT,
	multimedia: DataTypes.TEXT,
	reference: DataTypes.INTEGER,

    });

    comment_forum.associate = function(models){
    	//To create model associations

	comment_forum.belongsTo(models.topic,{
	    foreignKey: 'id_topic',
	    as: 'topics'
	});

	comment_forum.belongsTo(models.user,{
	    foreignKey: 'id_user',
	    as: 'users'
	});

    }

    return comment_forum;
}
