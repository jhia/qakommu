'use strict'

module.exports = (sequelize, DataTypes) => {
    const state = sequelize.define('state', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.TEXT
        },
        description:{
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        module_name:{
            type: DataTypes.TEXT
        },
        blocker:{
            type: DataTypes.BOOLEAN
        }
    });

    state.associate = function(models){
        //To create model associations

        //state to coupon
        state.hasMany(models.coupon ,{
            foreignKey: 'id_state',
            as: 'state_coupon'
        });

        //state to event
        state.hasMany(models.event, {
            foreignKey: 'id_state',
            as: 'state_event'
        });

        //state to ticket
        state.hasMany(models.ticket, {
            foreignKey: 'id_state',
            as: 'state_ticket'
        });
    }

    return state;
}