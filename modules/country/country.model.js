'use strict'
const { Deferrable } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    const Language = require('../language/language.model')(sequelize, DataTypes)
    const Country = sequelize.define('country', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alphaCode3: { //alphacode3
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'alpha_code_3'
        },
        phoneCode: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'phone_code'
        },
        languageId: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            field: 'id_language',
            references: {
                model: Language,
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        }
    }, {
        tableName: 'countries'
    })

    Country.exists = async function (id) {
        if(!id) {
            throw new Error('Country ID is required')
        }
        const country = await this.findByPk(id, { attributes: ['id'] })
        return !!country;
    }

    Country.findByCode = async function (code) {
        if(!code) {
            throw new Error('Country code is required')
        }
        return await this.findOne({
            where: {
                alphaCode3: code
            }
        })
    }

    return Country;
}