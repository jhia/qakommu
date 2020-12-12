'use strict'


const db = require('../../models');
const {schedule} = db;

module.exports = (sequelize, DataTypes) => {
    const activity = sequelize.define('activity', {
	title: DataTypes.TEXT,
	description: DataTypes.TEXT,
	start: {
	    type: DataTypes.DATE,
	    allowNull: false,
	    unique: {
		msg: 'date exist'
	    },    
	},
	end: {
	    type: DataTypes.DATE,
	    allowNull: false,
	    unique: {
		msg: 'date exist'
	    },    
	},
	color: DataTypes.TEXT,
	email_notification: DataTypes.BOOLEAN,
	reminder: DataTypes.TEXT,
	location: DataTypes.TEXT,
	time_zone: DataTypes.TEXT,
	repetition: DataTypes.TEXT,
    });

    activity.associate = function(models){

	activity.belongsToMany(models.schedule, {
	    as: "schedules",
	    through: "activity_schedule",
	    foreignKey: "id_activity",
	});
    }
    return activity

}
