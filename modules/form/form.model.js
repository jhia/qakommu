'use strict'

module.exports = (sequelize, DataTypes) => {
    const Form = sequelize.define('form', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        template: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'default'
        },
        options: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '{}',
            get: function () {
                return JSON.parse(this.getDataValue('options'))
            },
            set: function (value) {
                return this.setDataValue('options', JSON.stringify(value))
            }
        },
    }, {
        tableName: 'forms'
    });

    Form.associate = function(models){
        //To create model associations
        Form.hasMany(models.formItem, {
            foreignKey: 'id_form',
            as: 'items'
        })
    }

    return Form;
}