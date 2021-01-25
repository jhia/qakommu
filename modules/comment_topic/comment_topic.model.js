'use strict'

module.exports = (sequelize, DataTypes) => {

    const comment_topic = sequelize.define('comment_topic', {
	id_topic: DataTypes.INTEGER,
	id_user: DataTypes.INTEGER,
	name: DataTypes.TEXT,
	description: DataTypes.TEXT,
	multimedia: DataTypes.TEXT,
	reference: DataTypes.INTEGER,
    });

    comment_topic.associate = function(models){
    	//To create model associations

	comment_topic.belongsTo(models.topic,{
	    foreignKey: 'id_topic',
	    as: 'topics'
	});

	comment_topic.belongsTo(models.User,{
	    foreignKey: 'id_user',
	    as: 'users'
	});

    }

    return comment_topic;
}
