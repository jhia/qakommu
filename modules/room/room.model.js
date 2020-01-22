'use strict'

module.exports = (sequelize, DataTypes) => {
    const room = sequelize.define('room', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        name:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        description:{
            type: DataTypes.TEXT
        },
        max_capacity:{
            type: DataTypes.INTEGER
        },
        active:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });

    room.associate = function(models){
    	//To create model associations
    }

    return room;
}