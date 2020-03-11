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
        id_coupon:
        {
            //this field can go null
            type: DataTypes.INTEGER
        },
        count: {
            type: DataTypes.INTEGER
        },
        total_amount:{
            type: DataTypes.FLOAT
        },
        amount_paid: {
            type: DataTypes.FLOAT
        },
        paying_name: {
            type: DataTypes.TEXT
        },
        paying_address:{
            type: DataTypes.TEXT
        },
        dni_payer:{
            type: DataTypes.TEXT
        }
    });

    ticket_sale.associate = function(models){
    	//To create model associations
    }

    return ticket_sale;
}