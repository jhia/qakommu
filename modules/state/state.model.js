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
        state.hasMany(models.coupon ,{
            foreignKey: 'id_state',
            as: 'state_coupon'
        });
    }

    return state;
}