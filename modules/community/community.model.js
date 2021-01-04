'use strict';

module.exports = (sequelize, DataTypes) => {
    const community = sequelize.define('community', {
	name: {
	    type: DataTypes.STRING,
	    allowNull: false,
	    unique: {
		args: true,
		msg: 'name community  exists!'
	    }
	},
	description: DataTypes.STRING,
	id_type_of_account: DataTypes.INTEGER,
	users_count: DataTypes.INTEGER,
	id_website: DataTypes.INTEGER,
	prefix: DataTypes.STRING,
	member_verification: DataTypes.BOOLEAN,
	id_repository: DataTypes.INTEGER,
	code: {
	    type: DataTypes.STRING(6),
	    allowNull: false,
	    unique: {
		args: true,
		msg: 'code community exists!'
	    }
	},
	is_privated: {
	    type: DataTypes.BOOLEAN,
	    defaultValue: true 
	},     
    });

    community.associate = function (models) {
	// associations can be defined here
	community.hasMany(models.user_type, {
	    foreignKey: 'id_community',
	    as: 'user_types'
	});

	community.hasMany(models.post, {
	    foreignKey: 'id_community',
	    as: 'posts'
	});

	community.hasMany(models.event, {
	    foreignKey: 'id_community',
	    as: 'community_event'
	});

	community.hasMany(models.type_sponsor, {
	    foreignKey: 'id_community',
	    as: 'community_type_sponsor'
	});

	community.hasMany(models.type_booth, {
	    foreignKey: 'id_community',
	    as: 'community_type_booth'
	});

	community.hasMany(models.channel, {
	    foreignKey: 'id_community',
	    as: 'channels'
	});


	community.hasMany(models.survey, {
	    foreignKey: 'id_community',
	    as: 'community_survey'
	});

	community.hasMany(models.partnership, {
	    foreignKey: 'id_community',
	    as: 'community_partnership'
	});

    };

    return community;
};
