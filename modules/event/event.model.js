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
        },/*
        id_community:{
            allowNull: false,
            type: DataTypes.INTEGER
        },*/
        online:{
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
        },/*
        id_repository:{
            allowNull: false,
            type: DataTypes.INTEGER
        },*/
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

        //event to sponsor
        event.hasMany(models.sponsor, {
            foreignKey: 'id_event',
            as: 'event_sponsor'
        });
    }

    return event;
}