'use strict'

module.exports = (sequelize, DataTypes) => {
    const attendee = sequelize.define('attendee', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_user: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.TEXT
        },
        dni:{
            type: DataTypes.TEXT
        },
        present: {
            type: DataTypes.BOOLEAN
        },
        id_ticket_sale_detail:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        rate:{
            type: DataTypes.FLOAT
        },
        id_state:{
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });

    attendee.associate = function(models){
        //To create model associations
        attendee.belongsTo(models.ticket_sale_detail, {
            foreignKey: 'id_ticket_sale_detail',
            as: 'ticket_sale_detail'
        });
        
        attendee.belongsTo(models.state, {
            foreignKey: 'id_state',
            as: 'state'
        });
    }

    return attendee;
}