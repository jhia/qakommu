'use strict'
const { validateNotEmptyString } = require("../../helpers/validations");

module.exports = (sequelize, DataTypes) => {
    const Track = sequelize.define('track', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
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
            defaultValue: true
        },
        communityId: {
            field: 'id_community',
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        icon: DataTypes.STRING,
        hidden: {
            field: 'hidden',
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'tracks'
    });

    Track.associate = function (models) {
        // track to module
        Track.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });

    }


    Track.validateName = validateNotEmptyString;
    Track.validateDescription = validateNotEmptyString;
    Track.validateIcon = validateNotEmptyString

    
    Track.findByCommunity = function (communityId, options={}) {
        return this.findAll({
            where: {
                communityId,
                active: true,
                hidden: false
            },
            attributes: ['id', 'name', 'description', 'icon'],
            ...options
        })
    }

    return Track;
}