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
        
        //track_session to session
         track_session.belongsTo(models.session, {
            foreignKey: 'id_session',
            as: 'session'
        });

        //track_session to track
        track_session.belongsTo(models.track, {
            foreignKey: 'id_track',
            as: 'track'
        });

    }

    return track_session;
}