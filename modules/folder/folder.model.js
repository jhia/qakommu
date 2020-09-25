'use strict'

module.exports = (sequelize, DataTypes) => {
    const folder = sequelize.define('folder', {
	id_reference_location: DataTypes.INTEGER,
	name: {
	    type: DataTypes.TEXT,
	    allowNull: false,
	    unique: {
		msg: 'name exist'
	    },    
	}   
    });

    folder.associate = function(models){
	folder.belongsTo(models.reference_location, {
	    foreignKey: 'id_reference_location',
	    as: 'reference_location'
	});
    }

    return folder;
}
