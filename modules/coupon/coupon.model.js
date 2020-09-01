'use strict'

module.exports = (sequelize, DataTypes) => {
    const coupon = sequelize.define('coupon', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        name:{
            allowNull: false,
            type: DataTypes.TEXT
        },
        description:{
            type: DataTypes.TEXT
        },
        free:{
            type: DataTypes.BOOLEAN
        },
        percentage:{
            allowNull: false,
            type: DataTypes.FLOAT
        },
        id_state:{
            allowNull: false,
            type: DataTypes.INTEGER 
        },
        applicable_amount:{
            allowNull: false,
            type: DataTypes.INTEGER 
        },
        applicable_total_amount:{
            type: DataTypes.BOOLEAN
        },
        id_user_creator:{
            //this is user creator
            //allowNull: false,
            type: DataTypes.INTEGER 
        },
        active:{
            type: DataTypes.BOOLEAN
        },
        since: {
            type: DataTypes.DATE
        },
        until: {
            type: DataTypes.DATE
        },
        uuid: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        }
    });

    coupon.associate = function(models){
        //To create model associations
        coupon.belongsTo(models.state, {
            foreignKey: 'id_state',
            as: 'state'
        });

        coupon.hasMany(models.ticket, {
            foreignKey: 'id_coupon',
            as: 'coupon_ticket'
        });

        coupon.hasMany(models.ticket_sale, {
            foreignKey: 'id_coupon',
            as: 'coupon_ticket_sale'
        });
    }

    return coupon;
}