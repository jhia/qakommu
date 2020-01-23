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
            type: DataTypes.BLOB
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
        // associations can be defined here
        partnership.hasMany(models.partnership_position, {
            foreignKey: 'id_partnership',
            as: 'Partnership_position'
        });
    };

    return partnership;
}