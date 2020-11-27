'use strict'

module.exports = (sequelize, DataTypes) => {
    const like-forum = sequelize.define('like-forum', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		}
    });

    like-forum.associate = function(models){
    	//To create model associations
    }

    return like-forum;
}