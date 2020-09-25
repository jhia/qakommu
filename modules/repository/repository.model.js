'use strict'

module.exports = (sequelize, DataTypes) => {
    const repository = sequelize.define('repository', {
	name: DataTypes.TEXT,
	location: {
	    type: DataTypes.TEXT,
	    allowNull: false,
	},
	id_community: {
	    type: DataTypes.INTEGER,
	    allowNull: false,
	    unique: {
		msg: 'comunity exist'
	    },

	},
	active: DataTypes.BOOLEAN,
    });

    repository.associate = function (models) {
	repository.belongsTo(models.community, {
	    foreignKey: 'id_community',
	    as: 'community'
	});
    }

    return repository;
}
