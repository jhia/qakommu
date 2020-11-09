'use strict'

module.exports = (sequelize, DataTypes) => {
    const forum = sequelize.define('forum', {

	id_community: DataTypes.INTEGER,
	id_user: DataTypes.INTEGER,
	name: DataTypes.TEXT,
	description: DataTypes.TEXT,
	public_forum: DataTypes.BOOLEAN

    });

    forum.associate = function(models){
	//To create model associations

	forum.belongsTo(models.user,{
	    foreignKey: 'id_user',
	    as: 'users'
	});

	forum.belongsTo(models.community,{
	    foreignKey: 'id_community',
	    as: 'communities'
	});

	forum.belongsToMany(models.user, {
	    as: "userss",
	    through: "my_forum",
	    foreignKey: "id_forum",
	});










    }

    return forum;
}
