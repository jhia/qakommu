'use strict'

module.exports = (sequelize, DataTypes) => {
    const track_session = sequelize.define('track_session', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_session: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_track: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });

    track_session.associate = function(models){
    	//To create model associations
    }

    return track_session;
}