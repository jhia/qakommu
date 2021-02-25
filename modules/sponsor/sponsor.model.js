'use strict'
const { validateText } = require("../../helpers/validations");
module.exports = (sequelize, DataTypes) => {
    const Sponsor = sequelize.define('sponsor', {
        description: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.TEXT
        },
        eventId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_event',
            references: {
                model: { tableName: 'events' },
                key: 'id'
            }
        },
        partnershipId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_partnership',
            references: {
                model: { tableName: 'partnerships' },
                key: 'id'
            }
        },
        sponsorTypeId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_sponsor_type',
            references: {
                model: { tableName: 'sponsor_types' },
                key: 'id'
            }
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {
        tableName: 'sponsors'
    });

    Sponsor.associate = function (models) {
        //To create model associations

        //sponsor to partnership
        Sponsor.belongsTo(models.partnership, {
            foreignKey: 'id_partnership',
            as: 'partnership'
        });

        //sponsor to type_sponsor
        Sponsor.belongsTo(models.sponsorType, {
            foreignKey: 'id_sponsor_type',
            as: 'type'
        });

        Sponsor.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });
    }

    Sponsor.validateDescription = validateText

    return Sponsor;
}