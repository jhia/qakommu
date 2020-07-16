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
            //this field can go null
            type: DataTypes.INTEGER
        },
        /*id_coupon:
        {
            //this field can go null
            type: DataTypes.INTEGER
        },*/
        count: {
            type: DataTypes.INTEGER
        },
        total_amount: {
            type: DataTypes.FLOAT
        },
        total_amount_paid: {
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
        name_event: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    });

    ticket_sale.associate = function (models) {
        //To create model associations

        //ticket_sale to ticket_sale_detail
        ticket_sale.hasMany(models.ticket_sale_detail, {
            foreignKey: 'id_ticket_sale',
            as: 'ticket_sale_detail'
        });

    }

    return ticket_sale;
}