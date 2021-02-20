'use strict'

module.exports = (sequelize, DataTypes) => {
    const folder = sequelize.define('folder', {
	id_repository: DataTypes.INTEGER,
	name: {
	    type: DataTypes.TEXT,
	    allowNull: false,
	    unique: {
		msg: 'name exist'
	    },    
	}   
    });

    folder.associate = function(models){
	folder.belongsTo(models.repository, {
	    foreignKey: 'id_repository',
	    as: 'repository'
	});
    }

    return folder;
}
