'use strict'

module.exports = (sequelize, DataTypes) => {
    const schedule = sequelize.define('schedule', {
	time_zone: {
	    type: DataTypes.TEXT,
	    allowNull: false,
	    unique: {
		msg: 'time zone exist'
	    }
	},
    });

    schedule.associate = function(models){
	//To create model associations

	schedule.belongsToMany(models.activity, {
	    as: "activities",
	    through: "activity_schedule",
	    foreignKey: "id_schedule",
	});

    }

    return schedule;
}
