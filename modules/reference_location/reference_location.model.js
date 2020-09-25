'use strict'

module.exports = (sequelize, DataTypes) => {
    const reference_location = sequelize.define('reference_location', {
	id_repository: DataTypes.INTEGER,
 	reference: {
	    type: DataTypes.TEXT,
	    allowNull: false,
	    unique: {
		msg: 'location exist'
	    },    
	},
    });

    reference_location.associate = function(models){
 	reference_location.belongsTo(models.repository, {
	    foreignKey: 'id_repository',
	    as: 'repository'
	});
    }

    return reference_location;
}
