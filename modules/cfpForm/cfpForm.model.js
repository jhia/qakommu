'use strict'

module.exports = (sequelize, DataTypes) => {
    const CFPForm = sequelize.define('cfpForm', {
        formId: {
            field: 'id_form',
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        isTemplate: {
            field: 'is_template',
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_by: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
    }, {
        tableName: 'cfp_forms'
    });

    CFPForm.associate = function (models) {
        //To create model associations

        CFPForm.hasOne(models.event, {
            foreignKey: 'id_cfp_form',
            as: 'event'
        })

        CFPForm.belongsTo(models.form, {
            foreignKey: 'id_form',
            as: 'form'
        })

        CFPForm.belongsTo(models.user, {
            foreignKey: 'created_by',
            as: 'creator'
        })
    }

    return CFPForm;
}