'use strict'

module.exports = (sequelize, DataTypes) => {
    const FormItem = sequelize.define('formItem', {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
        },
        content: {
            type: DataTypes.TEXT,
            get: function() {
                const value = this.getDataValue('type')
                let regex = [/^list/, /^select/, /^date/]
                for(reg of regex) {
                    if(reg.test(value)) {
                        return JSON.parse(this.getDataValue('content'))
                    }
                }
                return this.getDataValue('content')
            },
            set: function(value) {
                const type = this.getDataValue('type')
                let regex = [/^list/, /^select/, /^date/]
                for(reg of regex) {
                    if(reg.test(type)) {
                        return this.setDataValue('content', JSON.stringify(value))
                    }
                }
                return this.setDataValue('content', value)
            }
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isInput: {
            field: 'is_input',
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        formId: {
            field: 'id_form',
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: { tableName: 'forms' },
                key: 'id'
            }
        },
    }, {
        tableName: 'form_items'
    });

    FormItem.associate = function (models) {
        //To create model associations
        FormItem.belongsTo(models.form, {
            foreignKey: 'id_form',
            as: 'form'
        })
    }

    return FormItem;
}