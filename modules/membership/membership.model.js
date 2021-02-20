'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Membership extends Model {}
    Membership.init({
        communityId: {
            field: 'id_community',
            type: DataTypes.INTEGER
        },
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
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'created_by'
          },
    }, {
        sequelize,
        modelName: 'membership',
        tableName: 'memberships'
    })

    Membership.associate = function(models) {
        Membership.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        })
        Membership.belongsTo(models.user, {
            foreignKey: 'createdBy',
            as: 'creator'
        })
    }

    return Membership;
}