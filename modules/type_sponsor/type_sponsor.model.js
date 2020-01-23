'use strict'

module.exports = (sequelize, DataTypes) => {
    const type_sponsor = sequelize.define('type_sponsor', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        description:{
            type: DataTypes.TEXT
        },
        contribution_value:{
            allowNull: false,
            type: DataTypes.FLOAT
        },
        currency:{
            allowNull: false,
            type: DataTypes.TEXT
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        }
    });

    type_sponsor.associate = function(models){
        //To create model associations
        type_sponsor.hasMany(models.sponsor, {
            foreignKey: 'id_type_sponsor',
            as: 'type_sponsor_sponsor'
        });
    }

    return type_sponsor;
}