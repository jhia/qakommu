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
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        reserved_current:{
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        limit_sale:{
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        max_ticket_sell: {
            type: DataTypes.INTEGER
        },
        start:{
            type: DataTypes.DATE
        },
        end:{
            type: DataTypes.DATE
        },
        //price1
        use_multiple_price1: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        price1:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        since1:{
            allowNull: true,
            type: DataTypes.DATE
        },
        until1:{
            allowNull: true,
            type: DataTypes.DATE
        },
        percentage1:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        is_discount1:{
            allowNull: true,
            type: DataTypes.BOOLEAN
        },
        //price2
        use_multiple_price2: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        price2:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        since2:{
            allowNull: true,
            type: DataTypes.DATE
        },
        until2:{
            allowNull: true,
            type: DataTypes.DATE
        },
        percentage2:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        is_discount2:{
            allowNull: true,
            type: DataTypes.BOOLEAN
        },
        //price 3
        use_multiple_price3: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        price3:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        since3:{
            allowNull: true,
            type: DataTypes.DATE
        },
        until3:{
            allowNull: true,
            type: DataTypes.DATE
        },
        percentage3:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        is_discount3:{
            allowNull: true,
            type: DataTypes.BOOLEAN
        },
        // price 4
        use_multiple_price4: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        price4:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        since4:{
            allowNull: true,
            type: DataTypes.DATE
        },
        until4:{
            allowNull: true,
            type: DataTypes.DATE
        },
        percentage4:{
            allowNull: true,
            type: DataTypes.FLOAT
        },
        is_discount4:{
            allowNull: true,
            type: DataTypes.BOOLEAN
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