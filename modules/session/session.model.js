'use strict'

module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('session', {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        roomId: {
            field: 'id_room',
            allowNull: false,
            type: DataTypes.INTEGER
        },
        order: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false
        },
        questionTime: {
            field: 'question_time',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        hasBreak: {
            field: 'has_break',
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        eventId: {
            field: 'id_event',
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'sessions'
    });

    Session.associate = function (models) {
        //To create model associations

        Session.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        })
        
        Session.belongsTo(models.room, {
            foreignKey: 'id_room',
            as: 'room'
        });
        
        /*Session.hasMany(models.speaker, {
            foreignKey: 'id_session',
            as: 'session_speaker'
        });*/

         //track to session
        Session.belongsToMany(models.track, {
            through: 'session_tracks',
            foreignKey: 'id_session',
            otherKey: 'id_track',
            as: 'tracks'
        });
        
        /*Session.hasMany(models.session_attendee, {
            foreignKey: 'id_session',
            as: 'session_session_attendee'
        });*/
    }

    return Session;
}