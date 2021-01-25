'use strict'

module.exports = (sequelize, DataTypes) => {
    const schedule = sequelize.define('schedule', {
	id_user: DataTypes.INTEGER,
	id_community: DataTypes.INTEGER,
	id_event: DataTypes.INTEGER,
	time_zone: {
	    type: DataTypes.TEXT,
	    allowNull: false,
	    unique: {
		msg: 'time zone exist'
	    }
	}
    });

    schedule.associate = function(models){

	schedule.belongsToMany(models.activity, {
	    as: "activities",
	    through: "activity_schedule",
	    foreignKey: "id_schedule",
	});

	schedule.belongsTo(models.user,{
	    foreignKey: 'id_user',
	    as: 'users'
	});

	schedule.belongsTo(models.Community,{
	    foreignKey: 'id_community',
	    as: 'communities'
	});

    }

    return schedule;
}
