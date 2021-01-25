'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Membership extends Model {}
    Membership.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0
        },
        duration: { // in months
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1 // a month
        },
        free: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Membership',
        tableName: 'memberships'
    })

    return Membership;
}