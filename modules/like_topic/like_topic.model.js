'use strict'

module.exports = (sequelize, DataTypes) => {
    const like_topic = sequelize.define('like_topic', {
	id_user: DataTypes.INTEGER,
	id_topic: DataTypes.INTEGER        
    });

    like_topic.associate = function(models){
	like_topic.belongsTo(models.topic,{
	    foreignKey: 'id_topic',
	    as: 'topics'
	});
    }

    return like_topic;
}
