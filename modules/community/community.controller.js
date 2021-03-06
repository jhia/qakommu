'use strict'

const { makeid } = require('../../helpers/utilities')


const Base = require('../../helpers/base.controller');
const controller = new Base('community');
const Archive = require('../../helpers/archive');
const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../http');

function llama(invitation_code, community_id, time) {
	let t;


	if (time) {
		t = time + "d";
	} else {
		t = "1d";
	};
	let tk = jwt.sign({
		data: { invitation_code, community_id }
	}, 'secret', { expiresIn: t });
	return tk;
}

const validAttributes = ['code', 'name', 'description', 'prefix', 'isPrivate', 'memberVerification', 'active'];


controller.getMyCommunities = async function (req, res) {
	const { limit, offset } = req.query;
	try {
		let userCommunities = await this.db.userCommunity.findAll({
			where: {
				userId: req.user.id,
				approved: true
			},
			limit,
			offset,
			include: [{
				model: this.db.community,
				as: 'community',
				attributes: validAttributes
			}],
			attributes: ['owner'],
		})

		let communities = userCommunities.map(c => {
			c.community.owner = c.owner;
			return c.community;
		})

		return res.send(communities)
	} catch ({ message }) {
		console.log(message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.getPublicCommunities = async function (req, res) {
	//	const q = req.query.q || '';  TODO: search option
	const { limit, offset } = req.query;

	try {
		const communities = await this.model.findAll({
			where: {
				isPrivate: false,
				active: true
			},
			limit,
			offset,
			attributes: validAttributes
		})

		return res.send(communities)
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.getOne = async function (req, res) {
	try {
		const community = await this.model.findByPk(req.community.id, { attributes: validAttributes })
		if (!community) {
			const notFoundError = new ResponseError(404, 'Community does not exist')
			return res.send(notFoundError)
		}
		return res.send(community)
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}

}

controller.getCommunityUsers = async function (req, res) {
	const { limit, offset } = req.query;
	try {
		let userCommunities = await this.db.userCommunity.findAll({
			where: {
				communityId: req.community.id,
				userId: req.user.id,
				approved: true,
			},
			limit,
			offset,
			include: [{
				model: this.db.user,
				as: 'user',
				attributes: ['firstName', 'lastName', 'username', 'profilePhoto'],
			}],
			attributes: ['owner'],
		})

		let users = await Promise.all(userCommunities.map(u =>{
			let user = {...u.user.dataValues};
			user.owner = !!u.dataValues.owner;
			return Archive.route(u.user.profilePhoto).then(r => {
				user.profilePhoto = r;
				return user;
			})
			.catch(() => user)
		}))
		return res.send(users)
	} catch ({ message }) {
		console.log(message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.getCountCommunityUsers = async function (req, res) {
	try {
		let count = await this.db.userCommunity.count({
			where: {
				communityId: req.community.id,
				userId: req.user.id,
				active: true,
			}
		});

		return res.send({ count })
	} catch ({ message }) {
		console.log(message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.postFunc = async function (req, res) {
	const {
		name, // required
		description, // required
		prefix, // required
		isPrivate, // default false
		memberVerification // default false, true if
	} = req.body;

	let communityData = {
		name,
		description,
		prefix,
		isPrivate: !!isPrivate, // needed as boolean
		// verify is 
		memberVerification: req.body.hasOwnProperty('memberVerification') ? !!memberVerification : !!isPrivate
	}

	const validationError = new ResponseError(400)

	// name
	try {
		if (!this.model.validateName(name)) {
			throw new Error('Name is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('name', message)
	}

	// description
	try {
		if (!this.model.validateDescription(description)) {
			throw new Error('Description is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('description', message)
	}

	// prefix
	try {
		if (!this.model.validatePrefix(prefix)) {
			throw new Error('This subdomain is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('prefix', message)
	}

	if (validationError.hasContext()) {
		return res.send(validationError)
	}

	// autogenerated code
	communityData.code = makeid(6)

	try {
		let newCommunity = await this.insert(communityData, { returning: [...validAttributes, 'id']})

		await this.db.userCommunity.create({
			userId: req.user.id,
			communityId: newCommunity.id,
			owner: true,
			membershipId: 1
		}, {
			fields: ['userId', 'communityId', 'owner', 'membershipId'],
			returning: ['id']
		});

		delete(newCommunity.id)
		res.statusCode = 201;
		return res.send(newCommunity)
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.putFunc = async function (req, res) {
	const {
		isPrivate, // default false
		memberVerification // default false
	} = req.body;
	let communityData = {};

	const validationError = new ResponseError(400);

	// name
	if (req.body.name) {
		try {
			if (!this.model.validateName(req.body.name)) {
				throw new Error('Name is not valid')
			}
			communityData.name = req.body.name
		} catch ({ message }) {
			validationError.addContext('name', message)
		}
	}

	// description
	if (req.body.description) {
		try {
			if (!this.model.validateDescription(req.body.description)) {
				throw new Error('Description is not valid')
			}
			communityData.description = req.body.description;
		} catch ({ message }) {
			validationError.addContext('description', message)
		}
	}

	// prefix
	if (req.body.prefix) {
		try {
			if (!this.model.validatePrefix(req.body.prefix)) {
				throw new Error('This subdomain is not valid')
			}
			communityData.prefix = req.body.prefix;
		} catch ({ message }) {
			validationError.addContext('prefix', message)
		}
	}

	if (req.body.hasOwnProperty('isPrivate')) {
		communityData.isPrivate = !!isPrivate;
	}

	if (req.body.hasOwnProperty('memberVerification')) {
		communityData.memberVerification = !!memberVerification;
	}

	if(req.body.hasOwnProperty('active')) {
		communityData.active = !!req.body.active;
	}

	if (validationError.hasContext()) {
		return res.send(validationError)
	}

	// if no data do nothing
	if(Object.keys(communityData) < 1) {
		return res.send();
	}

	try {
		let community = await this.update({
			id: req.community.id,
			data: communityData,
			returning: validAttributes
		})

		return res.send(community)
	} catch (err) {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}

}

controller.deleteFunc = async function (req, res) {
	if(req.community.id === 1) {
		const mainCommunityError = new ResponseError(400, 'Cannot delete default community');
		return res.send(mainCommunityError);
	}

	try {
		await this.db.userCommunity.destroy({
			where: {
				communityId: req.community.id
			}
		})
		let deleteRows = await this.delete(req.community.id)
		return res.send(deleteRows);
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

module.exports = controller;
