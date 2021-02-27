'use strict'

module.exports = (sequelize, DataTypes) => {
    const InputData = sequelize.define('inputData', {
        formItemId: {
            field: 'id_form_item',
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: 'input_data'
    });

    InputData.associate = function (models) {
        //To create model associations
        InputData.belongsTo(models.formItem, {
            foreignKey: 'id_form_item',
            as: 'formItem'
        })
    }

    return InputData;
}