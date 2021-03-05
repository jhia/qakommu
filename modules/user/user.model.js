'use strict';
const bcrypt = require('bcrypt');

function encrypt_password(password) {
	const saltRounds = 10;
	const newPassword = password || 'admin';
	return bcrypt.hashSync(newPassword, saltRounds);
}

const { validateDate, validateEmail } = require('../../helpers/validations')

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
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
		occupation: {
			type: DataTypes.STRING, // cooler if this is a datalist
			allowNull: false,
			field: 'occupation'
		},
		countryId: {
			field: 'id_country',
			type: DataTypes.INTEGER,
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
		tableName: 'users',
	})


	User.associate = function (models) {
		// associations can be defined here
		User.belongsToMany(models.community, {
			as: 'communities',
			through: "user_communities",
			foreignKey: "id_user",
			otherKey: 'id_community'
		})

		User.belongsTo(models.language, {
			as: 'language',
			foreignKey: 'id_language'
		})

		User.belongsTo(models.country, {
			as: 'country',
			foreignKey: 'id_country'
		})

		/*User.hasMany(models.user_channel, {
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
 		});*/
	};

	User.findByUsername = function (username, options={}) {
		if(!username) {
			throw new Error('Username is required')
		}
		return this.findOne({
			where: {
				username
			},
			...options
		})
	}
	
	User.validateFirstName = function (value) {
		if(!value) {
			throw new Error('First name is required')
		}
		return typeof value === typeof '' && !/[.0-9!_@#\d½º<>↓;?:¡¿|/[¨{}\$%\^\&*\])\(+=._-]/g.test(value);
	}

	User.validateLastName = function (value) {
		if(!value) {
			throw new Error('Last name is required')
		}
		return typeof value === typeof '' && !/[.0-9!_@#\d½º<>↓;?:¡¿|/[¨{}\$%\^\&*\])\(+=._-]/g.test(value);
	}

	User.validateBirthdate = function (value) {
		if(!value) {
			throw new Error('Date of birth is required')
		}
		return validateDate(value);
	}

	User.validateGender = function (value) {
		if(!value) {
			throw new Error('Gender is required')
		}
		return ['M', 'F', 'O'].includes(value.toUpperCase())
	}

	User.validateOccupation = function (value) {
		if(!value) {
			throw new Error('Occupation is required')
		}
		return typeof value === typeof '' && value.length >= 3;
	}

	User.validateOrganization = function (value) {
		return !!value && typeof value === typeof '' && value.length >= 3;
	}

	User.validateZipCode = function (value) {
		const regex = /^[a-z\d\-\s]+$/i;
		return regex.test(value);
	}

	User.validateUsername = async function (value) {
		const regex = /^[a-z\d._]+$/i;
		if(!value) {
			throw new Error('Username is required')
		}
		if(!regex.test(value)) {
			throw new Error('Username has unvalid characters')
		}
		try {
			const user = await this.findOne({
				where: { username: value },
				attributes: ['username']
			})
			return !user;
		} catch (err) {
			console.log(err.message)
			throw new Error('Try again later'); // connection error
		}
	}

	User.validateEmail = async function (value) {
		if(!value) {
			throw new Error('Email is required')
		}
		if(!validateEmail(value)) {
			throw new Error('Email has unvalid characters')
		}
		try {
			const user = await this.findOne({
				where: { email: value },
				attributes: ['email']
			})
			return !user;
		} catch (err) {
			throw new Error('Try again later'); // connection error
		}
	}

	User.ValidateEmailFormat = validateEmail;

	User.validatePassword = function (value) {
		if(!value) {
			throw new Error('Password is required')
		}
		const regex1 = /[a-zA-Z0-9]{8,}/;
		const regex2 = /[0-9]{1,}/;
		return regex1.test(value) && regex2.test(value);
	}

	User.prototype.comparePasswords = function (password) {
		return bcrypt.compareSync(password, this.password);
	}

	return User;
};
