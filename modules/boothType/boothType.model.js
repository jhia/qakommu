'use strict'

const { validateNotEmptyString, validateText, validateNotNegative, validatePositiveInteger } = require("../../helpers/validations");

module.exports = (sequelize, DataTypes) => {
    const BoothType = sequelize.define('boothType', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cost: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        width: {
            field: 'size_width',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            field: 'size_height',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        communityId: {
            field: 'id_community',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: { tableName: 'communities' },
                key: 'id'
            }
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'booth_types'
    });

    BoothType.associate = function (models) {
        //To create model associations

        // type_booth to exhibitor
        BoothType.hasMany(models.exhibitor, {
            foreignKey: 'id_booth_type',
            as: 'exhibitors'
        });

        //type_booth to community
        BoothType.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });
    }

    BoothType.exists = async function (id) {
		if(!id) {
			throw new Error('Booth Type ID is required')
		}
		const type = await this.findByPk(id, { attributes: ['id'] })
		return !!type;
	}

    BoothType.validateName = validateNotEmptyString;

    BoothType.validateDescription = validateText;

    BoothType.validateCost = validateNotNegative;

    BoothType.validateWidth = validatePositiveInteger;

    BoothType.validateHeight = validatePositiveInteger;

    return BoothType;
}