'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http')
const controller = new Base('user');
const Archive = require('../../helpers/archive');

const validAttributes = [
	'profilePhoto',
	'firstName', // required
	'lastName', // required
	'birthdate', // required
	'username', // required
	'email', // required
	'occupation', // required
	'gender', // required
	'organization',
	'languageId', // by default is country language, should be browser headers
];

controller.getMyUser = async function (req, res) {
	try {
		let user = await this.model.findByPk(req.user.id, {
			attributes: validAttributes,
			include: [this.model.associations.language]
		});

		user.profilePhoto = await Archive.route(user.profilePhoto);

		return res.send(user);
	} catch({ message }) {
		let err = new ResponseError(503, 'Try again later')
		return res.send(err);
	}
}

controller.getOne = async function (req, res) {
	const { username } = req.params;

	try {
		if(!this.model.validateUsername(username)) {
			throw new Error('Username is not valid')
		}
	} catch ({ message }) {
		const validationError = new ResponseError(400, message)
		return res.send(validationError)
	}

	try {
		let user = await this.model.findOne({
			where: {
				username,
				emailVerified: true,
				active: true
			},
			attributes: validAttributes,
			include: [this.model.associations.language]
		});

		if(!user) {
			const notFoundError = new ResponseError(404, 'User not found')
			return res.send(notFoundError)
		}

		user.profilePhoto = await Archive.route(user.profilePhoto);

		return res.send(user);
	} catch({ message }) {
		let err = new ResponseError(503, 'Try again later')
		return res.send(err);
	}
}


controller.getOneByEmail = async function (req, res) {
	const { email } = req.params;
	
	try {
		if(!this.model.ValidateEmailFormat(email)) {
			throw new Error('Email is not valid')
		}
	} catch ({ message }) {
		const validationError = new ResponseError(400, message)
		return res.send(validationError)
	}


	try {
		let user = await this.model.findOne({
			where: {
				email,
				emailVerified: true,
				active: true
			},
			attributes: validAttributes,
			include: [this.model.associations.language]
		});

		if(!user) {
			const notFoundError = new ResponseError(404, 'User not found')
			return res.send(notFoundError)
		}

		user.profilePhoto = await Archive.route(user.profilePhoto);

		return res.send(user);
	} catch({ message }) {
		
		let err = new ResponseError(503, 'Try again later')
		return res.send(err);
	}
}


controller.postFunc = async function (req, res) {
	const validationError = new ResponseError(400);

	let {
		firstName, // required
		lastName, // required
		birthdate, // required
		username, // required
		email, // required
		password, // required
		occupation, // required
		gender, // required
		country, // required
		organization,
		zipCode,
		city,
		language, // by default is country language, should be browser headers
		phoneCode, // by default is country code
		phoneNumber,
		community, // by default is 1
	} = req.body;

	// load required fields
	let userData = {
		firstName,
		lastName,
		birthdate,
		username,
		email,
		password,
		occupation,
		gender
	}

	// first name
	try {
		if (!this.model.validateFirstName(firstName)) {
			validationError.addContext('firstName', 'First name is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('firstName', message)
	}

	// last name
	try {
		if (!this.model.validateLastName(lastName)) {
			validationError.addContext('lastName', 'Last name is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('lastName', message)
	}

	// birthdate
	try {
		if (!this.model.validateBirthdate(birthdate)) {
			validationError.addContext('birthdate', 'Date of birth must follow the yyyy-mm-dd format')
		}
	} catch ({ message }) {
		validationError.addContext('birthdate', message)
	}

	// username
	try {
		if (!(await this.model.validateUsername(username))) {
			validationError.addContext('username', 'Username already in use')
		}
	} catch ({ message }) {
		validationError.addContext('username', message)
	}

	// email
	try {
		if (!(await this.model.validateEmail(email))) {
			validationError.addContext('email', 'Email already in use')
		}
	} catch ({ message }) {
		validationError.addContext('email', message)
	}

	// password
	try {
		if (!this.model.validatePassword(password)) {
			validationError.addContext('password', 'Password is not strong enough')
		}
	} catch ({ message }) {
		validationError.addContext('password', message)
	}

	// occupation
	try {
		if (!this.model.validateOccupation(occupation)) {
			validationError.addContext('occupation', 'Occupation is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('occupation', message)
	}

	// gender
	try {
		if (!this.model.validateGender(gender)) {
			validationError.addContext('gender', 'Gender is required')
		}
	} catch ({ message }) {
		validationError.addContext('gender', message)
	}

	// country
	try {
		const countryInfo = await this.db.country.findByCode(country);
		if(!countryInfo) {
			validationError.addContext('country', 'Country is not valid')
		} else {
			userData.countryId = countryInfo.id
			if(!language) {
				userData.languageId = countryInfo.languageId;
			}
		}
	} catch ({ message }) {
		validationError.addContext('country', message)
	}

	// organization
	if(!!organization) {
		try {
			if(!this.model.validateOrganization(organization)) {
				validationError.addContext('organization', 'Organization is not valid')
			} else {
				userData.organization = organization;
			}
		} catch ({ message }) {
			validationError.addContext('organization', message)
		}
	}

	// zip code
	if(!!zipCode) {
		try {
			if(!this.model.validateZipCode(zipCode)) {
				validationError.addContext('zipCode', 'Zip code is not valid')
			} else {
				userData.zipCode = zipCode
			}
		} catch ({ message }) {
			validationError.addContext('zipCode', message)
		}
	}

	// city
	if(!!city) {
		try {
			if(!this.model.validateCity(city)) {
				validationError.addContext('city', 'City is not valid')
			} else {
				userData.city = city;
			}
		} catch ({ message }) {
			validationError.addContext('city', message)
		}
	}

	// language
	if(!!language) {
		try {
			const lang = await this.db.language.findByCode(language)
			if(!lang) {
				validationError.addContext('language', 'Language is not valid')
			} else {
				userData.languageId = lang.id;
			}
		} catch({ message }) {
			validationError.addContext('language', message)
		}
	}
	
	// phone number
	if(!!phoneNumber) {
		try {
			if(!this.model.validatePhoneNumber(phoneNumber)) {
				validationError.addContext('phoneNumber', 'Phone number is not valid')
			} else {
				userData.phoneNumber = phoneNumber;
			}
		} catch ({ message }) {
			validationError.addContext('phoneNumber', message)
		}

		// phone code (validate phone number first)
		userData.phoneCode = !!phoneCode ? phoneCode : userData.country.phoneCode;
	}

	let communities = [1]

	if(community) {
		try {
			const communityInfo = await this.db.community.findByCode(community, { attributes: ['id'] })
			if(!communityInfo) {
				validationError.addContext('community', 'Community invitation is not valid')
			} else {
				communities.push(communityInfo.id);
			}
		} catch({ message }) {
			validationError.addContext('community', message)
		}
	}

	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		if(req.files && req.files.avatar && req.files.avatar !== 'not-image') {
			let avatar = new Archive('profile_photo', req.files.avatar);
			await avatar.upload();
			userData.profilePhoto = avatar.id;
		}

		let user = await this.insert(userData)

		await this.db.userCommunity.bulkCreate(communities.map(c => ({
			userId: user.id,
			communityId: c,
			owner: false
		})))

		res.statusCode = 201

		return res.send({
			username: user.username
		})

	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


controller.putFunc = async function (req, res) {
	const validationError = new ResponseError(400);
	let userData = {};

	// first name
	if (req.body.firstName) {
		try {
			if (!this.model.validateFirstName(req.body.firstName)) {
				validationError.addContext('firstName', 'First name is not valid')
			} else {
				userData.firstName = req.body.firstName;
			}
		} catch ({ message }) {
			validationError.addContext('firstName', message)
		}
	}

	// last name
	if (req.body.lastName) {
		try {
			if (!this.model.validateLastName(req.body.lastName)) {
				validationError.addContext('lastName', 'Last name is not valid')
			} else {
				userData.lastName = req.body.lastName;
			}
		} catch ({ message }) {
			validationError.addContext('lastName', message)
		}
	}

	if(req.body.birthdate) {
		// birthdate
		try {
			if (!this.model.validateBirthdate(req.body.birthdate)) {
				validationError.addContext('birthdate', 'Date of birth must follow the yyyy-mm-dd format')
			} else {
				userData.birthdate = req.body.birthdate;
			}
		} catch ({ message }) {
			validationError.addContext('birthdate', message)
		}
	}
	
	if(req.body.username) {
		// username
		try {
			if (!(await this.model.validateUsername(req.body.username))) {
				validationError.addContext('username', 'Username already in use')
			} else {
				userData.username = username;
			}
		} catch ({ message }) {
			validationError.addContext('username', message)
		}
	}

	if(req.body.occupation) {
		// occupation
		try {
			if (!this.model.validateOccupation(req.body.occupation)) {
				validationError.addContext('occupation', 'Occupation is not valid')
			} else {
				userData.occupation = req.body.occupation;
			}
		} catch ({ message }) {
			validationError.addContext('occupation', message)
		}
	}
	
	if(req.body.gender) {
		// gender
		try {
			if (!this.model.validateGender(req.body.gender)) {
				validationError.addContext('gender', 'Gender is required')
			} else {
				userData.gender = req.body.gender
			}
		} catch ({ message }) {
			validationError.addContext('gender', message)
		}
	}
	
	if(req.body.country) {
		// country
		try {
			const countryInfo = await this.db.country.findByCode(req.body.country);
			if(!countryInfo) {
				validationError.addContext('country', 'Country is not valid')
			} else {
				userData.country = countryInfo
			}
		} catch ({ message }) {
			validationError.addContext('country', message)
		}
	}
	
	// organization
	if(req.body.organization) {
		try {
			if(!this.model.validateOrganization(req.body.organization)) {
				validationError.addContext('organization', 'Organization is not valid')
			} else {
				userData.organization = req.body.organization;
			}
		} catch ({ message }) {
			validationError.addContext('organization', message)
		}
	}

	// zip code
	if(req.body.zipCode) {
		try {
			if(!this.model.validateZipCode(req.body.zipCode)) {
				validationError.addContext('zipCode', 'Zip code is not valid')
			} else {
				userData.zipCode = req.body.zipCode
			}
		} catch ({ message }) {
			validationError.addContext('zipCode', message)
		}
	}

	// city
	if(req.body.city) {
		try {
			if(!this.model.validateCity(req.body.city)) {
				validationError.addContext('city', 'City is not valid')
			} else {
				userData.city = req.body.city;
			}
		} catch ({ message }) {
			validationError.addContext('city', message)
		}
	}

	// language
	if(req.body.language) {
		try {
			const lang = await this.db.language.findByCode(req.body.language)
			if(!lang) {
				validationError.addContext('language', 'Language is not valid')
			} else {
				userData.language = lang;
			}
		} catch({ message }) {
			validationError.addContext('language', message)
		}
	}
		
	// phone number
	if(req.body.phoneNumber) {
		try {
			if(!this.model.validatePhoneNumber(req.body.phoneNumber)) {
				validationError.addContext('phoneNumber', 'Phone number is not valid')
			} else {
				userData.phoneNumber = req.body.phoneNumber;
			}
		} catch ({ message }) {
			validationError.addContext('phoneNumber', message)
		}

		// phone code (validate phone number first)
		userData.phoneCode = req.body.phoneCode || userData.country.phoneCode;
	}

	if(validationError.hasContext()) {
		return res.send(validationError);
	}

	try {
		let updatePicture = false;
		let previousAvatarName = null;
		if(req.files && req.files.avatar && req.files.avatar !== 'not-image') {
			let avatar = new Archive('profile_photo', req.files.avatar);
			await avatar.upload();
			userData.profilePhoto = avatar.id;
			updatePicture = true;
		}

		if(updatePicture) {
			let r = await this.model.findByPk(req.user.id, { attributes: ['profilePhoto'] });
			previousAvatarName = r.profilePhoto;
		}

		const rows = await this.update({
			id: req.user.id,
			data: userData
		});

		if(rows > 0 && userData.hasOwnProperty('profilePhoto') && updatePicture) {
			console.log('AVATAR', previousAvatarName);
			let prev = await Archive.fromString(previousAvatarName);
			await prev.remove();
		}

		return res.send([])
	} catch (err) {
		// connection error
		console.log(err.message)
		let connectionError = new ResponseError(503, 'Try again later');
		return res.send(connectionError);
	}
}

controller.updatePassword = async function (req, res) {
	let userData = {}
	const validationError = new ResponseError(400);
	if(req.body.password) {
		try {
			if(!this.model.validatePassword(req.body.password)) {
				throw new Error('Password is not valid')
			}
			userData.password = req.body.password;
		} catch ({message}) {
			validationError.addContext('password', message)
		}
	}

	if(validationError.hasContext()) {
		return res.send(validationError)
	}
	try {
		let rows = await this.model.update({
			id: req.user.id,
			data: userData
		})
		return res.send(rows)
	} catch(err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.deleteFunc = async function (req, res) {
	try {
		const { profilePhoto } = await this.model.findByPk(req.user.id);
		const rows = await this.delete(req.user.id);
		if(rows > 0 && !!profilePhoto) {
			let prev = await Archive.fromString(profilePhoto)
			await prev.remove();
		}
		res.send([]);
	} catch {
		const connectionError = new ResponseError(503, 'Try again later');
		return res.send(connectionError);
	}
}

module.exports = controller;
