'use strict'

module.exports = (sequelize, DataTypes) => {
    const data = sequelize.define('data', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_user: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_question:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_answer: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        text: {
            type: DataTypes.TEXT
        }
        
    });

    data.associate = function(models){
        //To create model associations
        
        data.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

        data.belongsTo(models.question, {
            foreignKey: 'id_question',
            as: 'question'
        });

        data.belongsTo(models.answer, {
            foreignKey: 'id_answer',
            as: 'answer'
        });

    }

    return data;
}