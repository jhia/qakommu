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
        },/*
        id_user:{
            //this is user creator
            //allowNull: false,
            type: DataTypes.INTEGER 
        },*/
        active:{
            type: DataTypes.BOOLEAN
        }
    });

    coupon.associate = function(models){
        //To create model associations
        coupon.belongsTo(models.state, {
            foreignKey: 'id_state',
            as: 'state'
        });
    }

    return coupon;
}