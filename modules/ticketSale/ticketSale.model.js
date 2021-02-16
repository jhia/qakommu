'use strict'

module.exports = (sequelize, DataTypes) => {
    const TicketSale = sequelize.define('ticketSale', {
        ticketId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_ticket'
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_user'
        },
        count: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        unitAmount: {
            allowNull: false,
            type: DataTypes.DOUBLE,
            field: 'unit_amount'
        },
        totalAmount: {
            allowNull: false,
            type: DataTypes.DOUBLE,
            field: 'total_amount'
        },
        totalAmountPaid: {
            allowNull: false,
            type: DataTypes.DOUBLE,
            field: 'total_amount_paid'
        },
        priceType: {
            type: DataTypes.TEXT,
            field: 'price_type'
        }
    }, {
        tableName: 'ticket_sales'
    });

    TicketSale.associate = function (models) {
        //To create model associations

        //ticket_sale to ticket_sale_detail
        TicketSale.hasMany(models.ticketSaleDetail, {
            foreignKey: 'id_ticket_sale',
            as: 'details'
        });

        /*TicketSale.belongsTo(models.coupon, {
            foreignKey: 'id_coupon',
            as: 'coupon'
        });*/

        TicketSale.belongsTo(models.ticket, {
            foreignKey: 'id_ticket',
            as: 'ticket'
        });

        TicketSale.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

    }

    return TicketSale;
}