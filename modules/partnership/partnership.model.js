'use strict'


module.exports = (sequelize, DataTypes) => {
    const partnership = sequelize.define('partnership', {
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
        registry_number: {
            type: DataTypes.TEXT
        },
        logo: {
            type: DataTypes.STRING
        },
        host:{
            type: DataTypes.TEXT
        },
        url: {
            type: DataTypes.TEXT
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        }

    });

    partnership.associate = function (models) {
        //To create model associations

        //partnership to partnership_position
        partnership.hasMany(models.partnership_position, {
            foreignKey: 'id_partnership',
            as: 'Partnership_position'
        });

        //partnership to sponsor
        partnership.hasMany(models.sponsor, {
            foreignKey: 'id_partnership',
            as: 'partnership_sponsor'
        });

        //partnership to exhibitor
        partnership.hasMany(models.exhibitor, {
            foreignKey: 'id_partnership',
            as: 'partnership_exhibitor'
        });


    };

    return partnership;
}