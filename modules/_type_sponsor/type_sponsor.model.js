'use strict'

module.exports = (sequelize, DataTypes) => {
    const type_sponsor = sequelize.define('type_sponsor', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        contribution_value: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        currency_symbol: {
            allowNull: false,
            type: DataTypes.ENUM('$', '€', '£'),
            defaultValue: '$'
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
        id_community: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        display_number:{
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });

    type_sponsor.associate = function (models) {
        //To create model associations
        type_sponsor.hasMany(models.sponsor, {
            foreignKey: 'id_type_sponsor',
            as: 'type_sponsor_sponsor'
        });

        type_sponsor.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });

    }

    return type_sponsor;
}