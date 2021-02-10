'use strict'

module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('room', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            allowNull: false,
            type: Sequelize.TEXT
        },
        maxCapacity: {
            field: 'max_capacity',
            type: DataTypes.INTEGER
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isOnline: {
            field: 'is_online',
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        urlClassroom: {
            field: 'url_classroom',
            type: Sequelize.TEXT
        },
        eventId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_event'
        },
    }, {
        tableName: 'rooms'
    });

    Room.associate = function (models) {
        //To create model associations

        Event.belongsTo(models.event, {
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