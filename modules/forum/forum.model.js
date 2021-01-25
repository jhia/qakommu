'use strict'

module.exports = (sequelize, DataTypes) => {
    const forum = sequelize.define('forum', {

	id_community: DataTypes.INTEGER,
	id_user: DataTypes.INTEGER,
	name: DataTypes.TEXT,
	description: DataTypes.TEXT,

    });

    forum.associate = function(models){

	forum.belongsTo(models.User,{
	    foreignKey: 'id_user',
	    as: 'users'
	});

	forum.belongsTo(models.Community,{
	    foreignKey: 'id_community',
	    as: 'communities'
	});

	forum.belongsToMany(models.User, {
	    as: "userss",
	    through: "my_forum",
	    foreignKey: "id_forum",
	});










    }

    return forum;
}
