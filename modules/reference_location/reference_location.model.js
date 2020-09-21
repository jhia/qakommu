'use strict'

module.exports = (sequelize, DataTypes) => {
    const reference_location = sequelize.define('reference_location', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		}
    });

    reference_location.associate = function(models){
    	//To create model associations
    }

    return reference_location;
}