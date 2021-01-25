'use strict'

module.exports = (sequelize, DataTypes) => {
    const repository_object = sequelize.define('repository_object', {
	name: {
	    type: DataTypes.TEXT,
	    allowNull: false,
	    unique: {
		msg: 'name exist'
	    },    
	},
	description: DataTypes.TEXT,
	id_user: DataTypes.INTEGER,        
	id_folder: DataTypes.INTEGER,        
	id_object_type: DataTypes.INTEGER,        
	size: DataTypes.INTEGER,        
	privated: DataTypes.BOOLEAN,        
	active: DataTypes.BOOLEAN,        

    });

    repository_object.associate = function(models){
	repository_object.belongsTo(models.User, {
	    foreignKey: 'id_user',
	    as: 'user'
	});

	repository_object.belongsTo(models.folder, {
	    foreignKey: 'id_folder',
	    as: 'folder'
	});

	repository_object.belongsTo(models.object_type, {
	    foreignKey: 'id_object_type',
	    as: 'object_type'
	});



    }

    return repository_object;
}
