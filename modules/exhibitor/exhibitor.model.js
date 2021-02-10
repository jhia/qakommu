'use strict'

module.exports = (sequelize, DataTypes) => {
    const Exhibitor = sequelize.define('exhibitor', {
        description: {
            allowNull: true,
            type: DataTypes.TEXT
        },
        eventId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_event'
        },
        partnershipId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_partnership'
        },
        boothTypeId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_booth_type'
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    Exhibitor.associate = function (models) {
        //To create model associations

        //exhibitor to type_booth
        Exhibitor.belongsTo(models.boothType, {
            foreignKey: 'id_booth_type',
            as: 'type'
        });

        //exhibitor to type_booth
        Exhibitor.belongsTo(models.partnership, {
            foreignKey: 'id_partnership',
            as: 'partner'
        });

        //exhibitor to event
        Exhibitor.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });
    }

    return Exhibitor;
}