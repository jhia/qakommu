'use strict'

module.exports = (sequelize, DataTypes) => {
    const session = sequelize.define('session', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        id_room: {
            type: DataTypes.INTEGER
        },
        order: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        start: {
            allowNull: false,
            type: DataTypes.DATE
        },
        end: {
            allowNull: false,
            type: DataTypes.DATE
        },
        is_break: {
            type: DataTypes.BOOLEAN
        }
    });

    session.associate = function (models) {
        //To create model associations

        //event to ticket
        session.hasMany(models.speaker, {
            foreignKey: 'id_session',
            as: 'session_speaker'
        });
    }

    return session;
}