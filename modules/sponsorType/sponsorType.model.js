'use strict'

module.exports = (sequelize, DataTypes) => {
    const SponsorType = sequelize.define('sponsorType', {
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        description: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        contributionValue: {
            allowNull: false,
            type: DataTypes.DOUBLE,
            field: 'contribution_value'
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        displayNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'display_number'
        },
        communityId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_community'
        }
    }, {
        tableName: 'sponsor_types'
    });

    SponsorType.associate = function (models) {
        //To create model associations
        SponsorType.hasMany(models.sponsor, {
            foreignKey: 'id_sponsor_type',
            as: 'sponsors'
        });

        SponsorType.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });

    }

    SponsorType.validateContributionValue = function (value) {
        return !isNaN(value) && value >= 0
    }

    return SponsorType;
}