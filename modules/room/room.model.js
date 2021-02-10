'use strict'

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

    return Room;
}