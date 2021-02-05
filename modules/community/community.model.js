'use strict';

const { userCommunity: UserCommunity } = require('../../models')

module.exports = (sequelize, DataTypes) => {
	const Community = sequelize.define('community', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		prefix: {
			type: DataTypes.STRING,
		},
		// member needs verification
		memberVerification: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			field: 'member_verification'
		},
		code: { // share code
			type: DataTypes.STRING,
			allowNull: false
		},
		isPrivate: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			field: 'is_private'
		}
	}, {
		tableName: 'communities'
	})

	Community.associate = function (models) {
		// associations can be defined here
		Community.belongsToMany(models.user, {
			as: 'members',
			through: "user_communities",
			foreignKey: "id_community",
		})

		/*Community.hasMany(models.post, {
			foreignKey: 'id_community',
			as: 'posts'
		});*/

		Community.hasMany(models.event, {
	    foreignKey: 'id_community',
	    as: 'events'
		});

		/*Community.hasMany(models.track, {
	    foreignKey: 'id_community',
	    as: 'community_track'
		});

		Community.hasMany(models.type_sponsor, {
	    foreignKey: 'id_community',
	    as: 'community_type_sponsor'
		});

		Community.hasMany(models.type_booth, {
	    foreignKey: 'id_community',
	    as: 'community_type_booth'
		});

		Community.hasMany(models.channel, {
	    foreignKey: 'id_community',
	    as: 'channels'
		});


		Community.hasMany(models.survey, {
	    foreignKey: 'id_community',
	    as: 'community_survey'
		});

		Community.hasMany(models.partnership, {
	    foreignKey: 'id_community',
	    as: 'community_partnership'
		});*/

	};

	Community.exists = async function (id) {
		if(!id) {
			throw new Error('Country ID is required')
		}
		const community = await this.findByPk(id, { attributes: ['id'] })
		return !!community;
	},

	Community.validateCode = async function (code) {
		if(!code) {
			throw new Error('Community code is required')
		}
		const community = await this.findOne({
			code
		})
		return !!community;
	},

	Community.findByCode = function (code) {
		if(!code) {
				throw new Error('Invitation code is required')
		}
		return this.findOne({
				where: {
					code
				}
		})
	}

	Community.findByUser = async function (userId) {
		let userCommunities = await UserCommunity.findAll({
			where: {
				userId: userId,
				[sequelize.Op.or]: [
					{ owner: true },
					{ approved: true }
				]
			},
			attributes: ['communityId']
		})

		let communities = await Community.findAll({
			where: {
				[sequelize.Op.or]: userCommunities.map(uc => ({ id: uc.communityId }))
			}
		})
	}

	return Community;
};
