'use strict'

const { validateNotEmptyString, validateText, validateDate, validatePositiveInteger, validateNotNegative, validateNotNegativeInteger } = require('../../helpers/validations');

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
            field: 'base_price',
            allowNull: false
        },
        quantityTotal: {
            type: DataTypes.INTEGER,
            field: 'quantity_total',
            allowNull: false
        },
        quantityCurrent: {
            type: DataTypes.INTEGER,
            field: 'quantity_current',
            allowNull: false,
            defaultValue: 0
        },
        reserved: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        reservedCurrent: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'reserved_current'
        },
        limitSale:{
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'limit_sale'
        },
        maxTicketSale: {
            type: DataTypes.INTEGER,
            field: 'max_ticket_sale',
            defaultVale: 0
        },
        start: {
            type: DataTypes.DATE
        },
        end:{
            type: DataTypes.DATE
        },
        isDraft: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_draft'
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
            field: 'is_discount3'
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
        Ticket.hasMany(models.ticketSale, {
            foreignKey: 'id_ticket',
            as: 'ticketSales'
        });

        //ticket to coupon
        /*ticket.hasMany(models.coupon, {
            foreignKey: 'id_ticket',
            as: 'ticket_coupon'
        });*/

    }

    Ticket.exists = async function (id) {
		if(!id) {
			throw new Error('Ticket ID is required')
		}
        const ticketCount = await this.count({ id })
        return ticketCount > 0;
    }

    Ticket.validateName = validateNotEmptyString;
    
    Ticket.validateDescription = validateText;

    Ticket.validateBasePrice = validateNotNegative;

    Ticket.validateQuantityTotal = validatePositiveInteger;

    Ticket.validateReserved = validateNotNegativeInteger;

    Ticket.validateMaxTicketSale = validatePositiveInteger;


    Ticket.prototype.getPrices = function () {
        let prices = {
            price1: {
                active: !!this.useMultiprice1,
                title: this.title1,
                since: this.since1,
                until: this.until1,
                price: this.price1,
                percentage: this.percentage1,
                isDiscount: this.isDiscount1
            },
            price2: {
                active: !!this.useMultiprice2,
                title: this.title2,
                since: this.since2,
                until: this.until2,
                price: this.price2,
                percentage: this.percentage2,
                isDiscount: this.isDiscount2
            },
            price3: {
                active: !!this.useMultiprice3,
                title: this.title3,
                since: this.since3,
                until: this.until3,
                price: this.price3,
                percentage: this.percentage3,
                isDiscount: this.isDiscount3
            },
            price4: {
                active: !!this.useMultiprice4,
                title: this.title4,
                since: this.since4,
                until: this.until4,
                price: this.price4,
                percentage: this.percentage4,
                isDiscount: this.isDiscount4
            }
        };
        return prices;
    }

    Ticket.prototype.getCurrentPrice = function() {
        let today = Date.now();

        if(!!this.useMultiprice1 && this.since1.getTime() >= today && this.until1.getTime() < today) {
            return {
                amount: this.price1,
                name: 'P1'
            }
        }

        if(!!this.useMultiprice2 && this.since2.getTime() >= today && this.until2.getTime() < today) {
            return {
                amount: this.price2,
                name: 'P2'
            }
        }

        if(!!this.useMultiprice3 && this.since3.getTime() >= today && this.until3.getTime() < today) {
            return {
                amount: this.price3,
                name: 'P3'
            }
        }

        if(!!this.useMultiprice4 && this.since4.getTime() >= today && this.until4.getTime() < today) {
            return {
                amount: this.price4,
                name: 'P4'
            }
        }

        return {
            amount: this.basePrice,
            name: 'P5'
        }
    }

    return Ticket;
}