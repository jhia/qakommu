'use strict'

module.exports = (sequelize, DataTypes) => {
    const answer = sequelize.define('answer', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_question: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        text: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        description: {
            type:DataTypes.TEXT
        } 

    });

    answer.associate = function(models){
        //To create model associations
        
        answer.belongsTo(models.question, {
            foreignKey: 'id_question',
            as: 'question'
        });

        answer.hasMany(models.data, {
            foreignKey: 'id_answer',
            as: 'answer_data'
        });
    }

    return answer;
}