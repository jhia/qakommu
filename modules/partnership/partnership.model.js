'use strict'
const { validateText, validateNotEmptyString,validateWEB } = require("../../helpers/validations");

module.exports = (sequelize, DataTypes) => {
    const Partnership = sequelize.define('partnership', {
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        logo: {
            type: DataTypes.TEXT,
        },
        web: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'partnerships'
    });

    Partnership.associate = function (models) {
        //To create model associations

        //partnership to sponsor
        Partnership.hasMany(models.sponsor, {
            foreignKey: 'id_partnership',
            as: 'sponsors'
        });

        //partnership to exhibitor
        Partnership.hasMany(models.exhibitor, {
            foreignKey: 'id_partnership',
            as: 'exhibitors'
        });
    };

    Partnership.exists = async function (id) {
		if(!id) {
			throw new Error('Partnership ID is required')
		}
		const partner = await this.findByPk(id, { attributes: ['id'] })
		return !!partner;
    }
    
    Partnership.validateName = validateNotEmptyString;

    Partnership.validateDescription = validateText;

    Partnership.validateWeb = validateWEB;

    return Partnership;
}