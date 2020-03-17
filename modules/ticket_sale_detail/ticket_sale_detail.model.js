'use strict'

module.exports = (sequelize, DataTypes) => {
    const ticket_sale_detail = sequelize.define('ticket_sale_detail', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        code_ticket: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        id_ticket_sale:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        deactivated:{
            type: DataTypes.BOOLEAN
        }
    });

    ticket_sale_detail.associate = function(models){
        //To create model associations
        
        ticket_sale_detail.belongsTo(models.ticket_sale, {
            foreignKey: 'id_ticket_sale',
            as: 'ticket_sale'
        });
    }

    return ticket_sale_detail;
}