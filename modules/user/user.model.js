'use strict';
const bcrypt = require('bcrypt');

function encrypt_password(password) {
	const saltRounds = 10;
	const newPassword = password || 'admin';
	return bcrypt.hashSync(newPassword, saltRounds);
}

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

	const Language = require('../language/language.model')(sequelize, DataTypes);
	const Country = require('../country/country.model')(sequelize, DataTypes);

	class User extends Model {

		static comparePasswords(password) {
			return bcrypt.compareSync(password, this.password);
		}
	}

	User.init({
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'last_name'
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		profilePhoto: {
			type: DataTypes.STRING,
			field: 'profile_photo'
		},
		organization: DataTypes.STRING, // only if needed, cooler if this is a datalist
		jobTitle: {
			type: DataTypes.STRING, // cooler if this is a datalist
			field: 'job_title'
		},
		countryId: {
			field: 'id_country',
			type: DataTypes.INTEGER,
			references: {
				model: Country,
				key: 'id'
			},
			allowNull: false
		},
		city: {
			type: DataTypes.STRING
		},
		zipCode: {
			field: 'zip_code',
			type: DataTypes.STRING, // maybe
		},
		phoneCode: {
			field: 'phone_code',
			type: DataTypes.STRING, // should be auto for country
		},
		phoneNumber: {
			field: 'phone_number',
			type: DataTypes.STRING,
		},
		languageId: {
			field: 'id_language',
			type: DataTypes.INTEGER,
			references: {
				model: Language,
				key: 'id'
			},
			allowNull: false
		},
		birthdate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		gender: {
			type: DataTypes.ENUM('M', 'F', 'O'), // M: male, F: female, O: Other; non-binary
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		emailVerified: { // user clicked the link to verify email
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			field: 'email_verified'
		},
		lastLogin: {
			type: DataTypes.DATE,
			field: 'last_login'
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set(value) {
				this.setDataValue('password', encrypt_password(value))
			}
		},
	}, {
		sequelize,
		modelName: 'user',
		tableName: 'users'
	})


	User.associate = function (models) {
		// associations can be defined here
		User.belongsToMany(models.community, {
			as: 'communities',
			through: "user_communities",
			foreignKey: "id_user",
		})

		User.hasMany(models.user_channel, {
			foreignKey: 'id_user',
			as: 'user_channels'
		});


		User.hasMany(models.post, {
			foreignKey: 'id_user',
			as: 'posts'
		});

		//User to speaker
		User.hasMany(models.speaker, {
			foreignKey: 'id_user',
			as: 'user_speaker'
		});

		
		//User to ticket_sale
		User.hasMany(models.ticket_sale, {
			foreignKey: 'id_user',
			as: 'user_ticket_sale'
		});

		//User to coupon
		User.hasMany(models.coupon, {
			foreignKey: 'id_user',
			as: 'user_coupon'
		});


		//User to attendee
		User.hasMany(models.attendee, {
			foreignKey: 'id_user',
			as: 'user_attendee'
		});

		//User to data
		User.hasMany(models.data, {
			foreignKey: 'id_user',
			as: 'user_data'
		});


		User.belongsToMany(models.forum, {
			as: "forums",
			through: "my_forum",
			foreignKey: "id_user",
 		});
	};

	return User;
};
