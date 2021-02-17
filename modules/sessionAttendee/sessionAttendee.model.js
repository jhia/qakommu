'use strict'

const { validateDescription } = require("../../helpers/validations");

module.exports = (sequelize, DataTypes) => {
    const SessionAttendee = sequelize.define('sessionAttendee', {
        sessionId:{
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_session'
        },
        attendeeId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_attendee'
        },
        rate: DataTypes.FLOAT,
        isPresent: { // null until session start
            field: 'is_present',
            defaultValue: false,
            type: DataTypes.BOOLEAN
        },
        comment: DataTypes.TEXT
    }, {
        tableName: 'session_attendees'
    });

    SessionAttendee.associate = function(models){
        //To create model associations

        //sessions_attendee to session
        SessionAttendee.belongsTo(models.session, {
            foreignKey: 'id_session',
            as: 'session'
        });

        //sessions_attendee to attendee
        SessionAttendee.belongsTo(models.attendee, {
            foreignKey: 'id_attendee',
            as: 'attendee'
        });
    }

    SessionAttendee.validateRate = function (value) {
        if(!value) {
            throw new Error('Rate is required')
        }

        return value >= 0 && value <= 100;
    }

    SessionAttendee.validateComment = validateDescription;

    return SessionAttendee;
}