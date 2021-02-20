'use strict'

module.exports = (sequelize, DataTypes) => {
    const SessionTrack = sequelize.define('sessionTracks', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        sessionId: {
            field: 'id_session',
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        trackId: {
            field: 'id_track',
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'session_tracks'
    });

    SessionTrack.associate = function (models) {
        //To create model associations
        
        // session
         SessionTrack.belongsTo(models.session, {
            foreignKey: 'id_session',
            as: 'session'
        });

        // track
        SessionTrack.belongsTo(models.track, {
            foreignKey: 'id_track',
            as: 'track'
        });

    }

    return SessionTrack;
}