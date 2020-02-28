'use strict'

module.exports = (sequelize, DataTypes) => {
    const repository_object = sequelize.define('repository_object', {
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
        location: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        id_repository: {
            type: DataTypes.INTEGER
        },
        id_object_type: {
            type: DataTypes.INTEGER
        }
    });

    repository_object.associate = function(models){
    	//To create model associations
    }

    return repository_object;
}