'use strict'

module.exports = (sequelize, DataTypes) => {
    const survey = sequelize.define('survey', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        id_event: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        id_community: {
            allowNull: false,
            type: DataTypes.INTEGER
        }

    });

    survey.associate = function (models) {
        //To create model associations

        survey.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: "event"
        });

        survey.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: "community"
        });

        survey.hasMany(models.question, {
            foreignKey: 'id_survey',
            as: 'survey_question'
        });
    }

    return survey;
}