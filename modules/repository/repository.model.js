'use strict'

module.exports = (sequelize, DataTypes) => {
    const repository = sequelize.define('repository', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		}
    });

    repository.associate = function(models){
    	//To create model associations
    }

    return repository;
}