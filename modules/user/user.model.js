'use strict';
const _ = require('lodash');
const bcrypt = require('bcrypt');

function encrypt_password(password) {
	const saltRounds = 10;
	const newPassword = password || 'admin';
	return bcrypt.hashSync(newPassword, saltRounds);
}

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define('user', {
		name: DataTypes.STRING,
		last_name: DataTypes.STRING,
		username: DataTypes.STRING,
		dni: DataTypes.STRING,
		profile_photo: DataTypes.STRING,
		host: DataTypes.STRING,
		type: DataTypes.ENUM('professional', 'student', 'other'),
		organization: DataTypes.STRING,
		country: DataTypes.STRING,
		city: DataTypes.STRING,
		zip_code: DataTypes.STRING,
		address: DataTypes.STRING,
		country_code: DataTypes.STRING,
		phone: DataTypes.STRING,
		birthdate: {
			type: DataTypes.DATE
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			},
			unique: {
				args: true,
				msg: 'Email address already in use!'
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: true
		},
		gender: DataTypes.STRING,
		id_repository: DataTypes.INTEGER,
		last_login: DataTypes.DATE
	},
		{
			hooks: {
				beforeCreate: function (model) {
					model.password = encrypt_password(model.password);
				},
				beforeBulkUpdate: function (model) {
					model.attributes.password = encrypt_password(model.attributes.password)
				}
			}
		});

	user.associate = function (models) {
		// associations can be defined here
		user.hasMany(models.user_type, {
			foreignKey: 'id_user',
			as: 'user_types'
		});

		user.hasMany(models.user_channel, {
			foreignKey: 'id_user',
			as: 'user_channels'
		});


		user.hasMany(models.post, {
			foreignKey: 'id_user',
			as: 'posts'
		});

		//user to speaker
		user.hasMany(models.speaker, {
			foreignKey: 'id_user',
			as: 'user_speaker'
		});

		
		//user to ticket_sale
		user.hasMany(models.ticket_sale, {
			foreignKey: 'id_user',
			as: 'user_ticket_sale'
		});

		//user to coupon
		user.hasMany(models.coupon, {
			foreignKey: 'id_user',
			as: 'user_coupon'
		});


		//user to attendee
		user.hasMany(models.attendee, {
			foreignKey: 'id_user',
			as: 'user_attendee'
		});

		//user to data
		user.hasMany(models.data, {
			foreignKey: 'id_user',
			as: 'user_data'
		});


		user.belongsToMany(models.forum, {
		        as: "forums",
		        through: "my_forum",
	 	        foreignKey: "id_user",
 		});




	};

	return user;
};
