'use strict'
const { Model, Deferrable } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    const Language = require('../language/language.model')(sequelize, DataTypes)

    class Country extends Model {}

    Country.init({
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
        timestamps: false,
        sequelize,
        modelName: 'Country',
        tableName: 'countries',
    });

    return Country;
}