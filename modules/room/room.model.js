'use strict'

const { validateNotEmptyString, validateText } = require("../../helpers/validations");

module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('room', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        maxCapacity: {
            field: 'max_capacity',
            type: DataTypes.INTEGER
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isOnline: {
            field: 'is_online',
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        urlClassroom: {
            field: 'url_classroom',
            type: DataTypes.TEXT
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_event'
        },
    }, {
        tableName: 'rooms'
    });

    Room.associate = function (models) {
        //To create model associations

        Room.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        })

        Room.hasMany(models.session, {
            foreignKey: 'id_room',
            as: 'sessions'
        });
    }

    Room.validateName = validateNotEmptyString;

    Room.validateDescription = validateText;

    Room.validateMaxCapacity = function (value) {
        return !isNaN(value) && value >= 0;
    }

    Room.validateUrlClassroom = function (value) {
        if(!value) {
            throw new Error('URL for classroom is required')
        }
        return typeof value === typeof '' && value.length > 0;
    }

    return Room;
}