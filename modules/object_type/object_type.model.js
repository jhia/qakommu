'use strict'

module.exports = (sequelize, DataTypes) => {
    const object_type = sequelize.define('object_type', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		}
    });

    object_type.associate = function(models){
    	//To create model associations
    }

    return object_type;
}