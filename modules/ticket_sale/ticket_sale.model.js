'use strict'

module.exports = (sequelize, DataTypes) => {
    const ticket_sale = sequelize.define('ticket_sale', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_ticket:
        {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_user: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        count: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        unit_amount:{
            allowNull: false,
            type: DataTypes.FLOAT
        },
        total_amount: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        total_amount_paid: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        paying_name: {
            type: DataTypes.TEXT
        },
        paying_address: {
            type: DataTypes.TEXT
        },
        dni_payer: {
            type: DataTypes.TEXT
        },
        name_ticket: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        price_type: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        id_coupon:{
            allowNull: true,
            type: DataTypes.INTEGER
        }
    });

    ticket_sale.associate = function (models) {
        //To create model associations

        //ticket_sale to ticket_sale_detail
        ticket_sale.hasMany(models.ticket_sale_detail, {
            foreignKey: 'id_ticket_sale',
            as: 'ticket_sale_detail'
        });

        ticket_sale.belongsTo(models.coupon, {
            foreignKey: 'id_coupon',
            as: 'coupon'
        });

        ticket_sale.belongsTo(models.ticket, {
            foreignKey: 'id_ticket',
            as: 'ticket'
        });

        ticket_sale.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

    }

    return ticket_sale;
}