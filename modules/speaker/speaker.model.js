'use strict'

module.exports = (sequelize, DataTypes) => {
    const speaker = sequelize.define('speaker', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_user: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_event: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_state: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_session: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });

    speaker.associate = function(models){
        //To create model associations
        //speaker to user
        speaker.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

        //speaker to event
        speaker.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });

        //speaker to state
        speaker.belongsTo(models.state, {
            foreignKey: 'id_state',
            as: 'state'
        });

        //speaker to session
        speaker.belongsTo(models.session, {
            foreignKey: 'id_session',
            as: 'session'
        });
    }

    return speaker;
}