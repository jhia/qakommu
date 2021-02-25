'use strict'

module.exports = (sequelize, DataTypes) => {
    const partnership_position = sequelize.define('partnership_position', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        job_title:{
            allowNull: false,
            type: DataTypes.TEXT
        }, 
        description:{
            type: DataTypes.TEXT
        },
        name_contact:{
            type: DataTypes.TEXT
        },
        email:{
            type: DataTypes.TEXT
        },
        phone:{
            type: DataTypes.TEXT
        },
        active:{
            type: DataTypes.BOOLEAN
        },
        id_partnership:{
            allowNull: false,
            type: DataTypes.INTEGER
        }
        
    });
    
    partnership_position.associate = function(models){
        //To create model associations
        partnership_position.belongsTo(models.partnership, {
            foreignKey: 'id_partnership',
            as: 'partnership'
        });
    }
    return partnership_position;
}