'use strict'

module.exports = (sequelize, DataTypes) => {
    const ticket = sequelize.define('ticket', {
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
        id_state: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_event: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        base_price: {
            type: DataTypes.FLOAT
        },
        quantity_total: {
            type: DataTypes.INTEGER
        },
        quantity_current: {
            type: DataTypes.INTEGER
        },
        reserved: {
            type: DataTypes.INTEGER
        },
        max_ticket_sell: {
            type: DataTypes.INTEGER
        },
        min_ticket_sell: {
            type: DataTypes.INTEGER
        },
        start:{
            type: DataTypes.DATE
        },
        end:{
            type: DataTypes.DATE
        }

    });

    ticket.associate = function (models) {
        //To create model associations

        //ticket to state
        ticket.belongsTo(models.state, {
            foreignKey: 'id_state',
            as: 'state'
        });

        //ticket to event
        ticket.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });

    }

    return ticket;
}