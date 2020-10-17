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
        percentage:{
            allowNull: false,
            type: DataTypes.FLOAT
        },
        id_state:{
            allowNull: false,
            type: DataTypes.INTEGER 
        },
        limit:{
            type: DataTypes.INTEGER 
        },
        original_limit:{
            type: DataTypes.INTEGER,
        },
        unlimited:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        },
        free_use:{
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_reserved:{
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        id_user:{
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        id_ticket:{
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        id_event:{
            allowNull: true,
            type: DataTypes.INTEGER
        }
    });

    coupon.associate = function(models){
        //To create model associations
        coupon.belongsTo(models.state, {
            foreignKey: 'id_state',
            as: 'state'
        });

        coupon.belongsTo(models.ticket, {
            foreignKey: 'id_ticket',
            as: 'ticket'
        });

        coupon.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });

        coupon.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

        coupon.hasMany(models.ticket_sale, {
            foreignKey: 'id_coupon',
            as: 'coupon_ticket_sale'
        });
    }

    return coupon;
}