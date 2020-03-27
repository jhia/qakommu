'use strict'

module.exports = (sequelize, DataTypes) => {
    const session_attendee = sequelize.define('session_attendee', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_session:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_attendee:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        rate:{
            type: DataTypes.FLOAT
        },
        is_present:{
            type: DataTypes.BOOLEAN
        }
    });

    session_attendee.associate = function(models){
    	//To create model associations
    }

    return session_attendee;
}