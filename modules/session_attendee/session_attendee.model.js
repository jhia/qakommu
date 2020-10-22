'use strict'

module.exports = (sequelize, DataTypes) => {
    const session_attendee = sequelize.define('session_attendee', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_session:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_attendee:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        rate:{
            type: DataTypes.FLOAT
        },
        is_present:{
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        },
        comment:{
            allowNull: true,
            type: DataTypes.TEXT
        }
    });

    session_attendee.associate = function(models){
        //To create model associations

        //sessions_attendee to session
        session_attendee.belongsTo(models.session, {
            foreignKey: 'id_session',
            as: 'session'
        });

        //sessions_attendee to attendee
        session_attendee.belongsTo(models.attendee, {
            foreignKey: 'id_attendee',
            as: 'attendee'
        });
    }

    return session_attendee;
}