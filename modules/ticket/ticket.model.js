'use strict'

module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('ticket', {
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        description: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        eventId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_event'
        },
        basePrice: {
            type: DataTypes.FLOAT,
            field: 'base_price'
        },
        quantityTotal: {
            type: DataTypes.INTEGER,
            field: 'quantity_total'
        },
        quantityCurrent: {
            type: DataTypes.INTEGER,
            field: 'quantity_current'
        },
        reserved: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        currentReserved: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'reserved_current'
        },
        limitSale:{
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        maxTicketSale: {
            type: DataTypes.INTEGER
        },
        start: {
            type: DataTypes.DATE
        },
        end:{
            type: DataTypes.DATE
        },
        //price1
        useMultiprice1: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'use_multiprice_1'
        },
        title1:{
            allowNull: true,
            type: DataTypes.TEXT
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
        isDiscount1: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            field: 'is_discount1'
        },
        //price2
        useMultiprice2: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'use_multiprice_2'
        },
        title2:{
            allowNull: true,
            type: DataTypes.TEXT
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
        isDiscount2:{
            allowNull: true,
            type: DataTypes.BOOLEAN,
            field: 'is_discount2'
        },
        //price 3
        useMultiprice3: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'use_multiprice_1'
        },
        title3:{
            allowNull: true,
            type: DataTypes.TEXT
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
        isDiscount3:{
            allowNull: true,
            type: DataTypes.BOOLEAN,
            field: 'isDiscount3'
        },
        // price 4
        useMultiprice4: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'use_multiprice_4'
        },
        title4:{
            allowNull: true,
            type: DataTypes.TEXT
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
        isDiscount4:{
            allowNull: true,
            type: DataTypes.BOOLEAN,
            field: 'is_discount4'
        }
    }, {
        tableName: 'tickets'
    });

    Ticket.associate = function (models) {
        //To create model associations

        //ticket to event
        Ticket.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });

        //ticket to ticket_sale
        /*Ticket.hasMany(models.ticket_sale, {
            foreignKey: 'id_ticket',
            as: 'ticket_ticket_sale'
        });*/

        //ticket to coupon
        /*ticket.hasMany(models.coupon, {
            foreignKey: 'id_ticket',
            as: 'ticket_coupon'
        });*/

    }

    return Ticket;
}