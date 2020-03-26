'use strict'

module.exports = (sequelize, DataTypes) => {
    const event = sequelize.define('event', {
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
        type:{
            allowNull: false,
            type: DataTypes.ENUM('c', 'w', 'm')

        },
        id_community:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        online:{
            type: DataTypes.BOOLEAN
        },
        no_cfp:{
            type: DataTypes.BOOLEAN
        },
        url_code:{
            type: DataTypes.TEXT
        },
        id_webside:{
            type: DataTypes.INTEGER
        },
        is_private:{
            type: DataTypes.BOOLEAN
        },
        start: {
            type: DataTypes.DATE
        },
        end: {
            type: DataTypes.DATE
        },
        active:{
            type: DataTypes.BOOLEAN
        },/*
        id_call_for_paper:{
            allowNull: false,
            type: DataTypes.INTEGER
        },*/
        prom_rate: {
            type: DataTypes.FLOAT
        },
        id_repository:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_state:{
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });

    event.associate = function(models){
        //To create model associations
        
        //evento to state
        event.belongsTo(models.state, {
            foreignKey: 'id_state',
            as: 'state'
        });

        //event to community
        event.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });

        //event to repository
        event.belongsTo(models.repository, {
            foreignKey: 'id_repository',
            as: 'repository'
        });

        //event to sponsor
        event.hasMany(models.sponsor, {
            foreignKey: 'id_event',
            as: 'event_sponsor'
        });
        
        //event to exhibitor
        event.hasMany(models.exhibitor, {
            foreignKey: 'id_event',
            as: 'event_exhibitor'
        });

        //event to ticket
        event.hasMany(models.ticket, {
            foreignKey: 'id_event',
            as: 'event_ticket'
        });

        //event to speaker
        event.hasMany(models.speaker, {
            foreignKey: 'id_event',
            as: 'event_speaker'
        });
    }

    return event;
}