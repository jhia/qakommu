'use strict'

module.exports = (sequelize, DataTypes) => {
    const question = sequelize.define('question', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        text: {
            allowNull: true,
            type: DataTypes.TEXT
        },
        id_survey:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        type_question: {
            allowNull: false,
            // s = simple, m = multiple, t = text, r = rate
            type: DataTypes.ENUM('s','m','t','r')
        },
        rate:{
            type: DataTypes.FLOAT
        }
    });

    question.associate = function(models){
        //To create model associations
        question.belongsTo(models.survey, {
            foreignKey: 'id_survey',
            as: 'survey'
        });

        question.hasMany(models.answer, {
            foreignKey: 'id_question',
            as: 'question_answer'
        });

        question.hasMany(models.data, {
            foreignKey: 'id_question',
            as: 'question_data'
        });
    }

    return question;
}