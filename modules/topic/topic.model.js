'use strict'

module.exports = (sequelize, DataTypes) => {
    const topic = sequelize.define('topic', {

	id_forum: DataTypes.INTEGER,
	id_user: DataTypes.INTEGER,
	name: DataTypes.TEXT,
	description: DataTypes.TEXT,

    });

    topic.associate = function(models){

	topic.belongsTo(models.forum,{
	    foreignKey: 'id_forum',
	    as: 'forums'
	});

	topic.belongsTo(models.User,{
	    foreignKey: 'id_user',
	    as: 'users'
	});

    }

    return topic;
}
