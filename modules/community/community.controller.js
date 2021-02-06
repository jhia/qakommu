'use strict'

const { makeid, dynamic_host } = require('../../helpers/utilities')


const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('community');

const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../http');

function llama(invitation_code, community_id ,time) {
    let t;


    if (time){ 
	t = time+"d";
    }else{ 
	t = "1d";
    };
    let tk = jwt.sign({
	data: { invitation_code, community_id}
    }, 'secret', { expiresIn: t });    
    return tk;
}


controller.getMyCommunities = async function (req, res) {
		const { limit, offset } = req.query;
    try {
			let userCommunities = await this.db.userCommunities.find({
				where: {
					userId: req.user.id,
					active: true
				},
				limit,
				offset,
				include: [this.db.userCommunity.associations.community],
				attributes: ['userId', 'owner', 'communityId', 'community'],
			})

			return res.send(userCommunities)
		} catch ({ message }) {
			console.log(message)
			const connectionError = new ResponseError(503, 'Try again later')
			return res.send(connectionError)
    }
}

controller.getPublicCommunities = async function(req, res) {
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
			attributes: ['code', 'name', 'description', 'prefix', 'memberVerification']
		})
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.getOne = async function (req, res) {
	const { id } = req.params;

	try {
		const community = await this.model.findByCode(id)
		if(!community) {
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

controller.postFunc = async function (req, res) {
	const {
		name, // required
		description, // required
		prefix, // required
		isPrivate, // default false
		memberVerification // default false
	} = req.body;

	let communityData = {
		name,
		description,
		prefix
	}

	const validationError = new ResponseError(400)

	// name
	try {
		if(!this.model.validateName(name)) {
			throw new Error('Name is not valid')
		}
	} catch ({message}) {
		validationError.addContext('name', message)
	}

	// description
	try {
		if(!this.model.validateDescription(description)) {
			throw new Error('Description is not valid')
		}
	} catch ({message}) {
		validationError.addContext('description', message)
	}

	// prefix
	try {
		if(!this.model.validatePrefix(prefix)) {
			throw new Error('This subdomain is not valid')
		}
	} catch ({message}) {
		validationError.addContext('prefix', message)
	}

	if(req.body.hasOwnProperty('isPrivate')) {
		communityData.isPrivate = !!isPrivate;
	}

	if(req.body.hasOwnProperty('memberVerification')) {
		communityData.memberVerification = !!memberVerification;
	}

	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	// autogenerated code
	communityData.code = makeid(6)

	try {
		let newCommunity = await this.insert(communityData)

		let communityAssociation = await this.db.userCommunity.build({
			userId: req.user.id,
			communityId: newCommunity.id,
			owner: true,
			membershipId: 1
		})

		await communityAssociation.save();

		res.statusCode = 201;
		return res.send(newCommunity)
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.putFunc = async function (req, res) {
		const { id } = req.params;
		
		const {
			name, // required
			description, // required
			prefix, // required
			isPrivate, // default false
			memberVerification // default false
		} = req.body;
		let communityData = {};

		const { name, description, id_type_of_account, users_count, id_website, prefix, member_verification, id_repository, code, is_private, return_data } = req.body;
		
		
	// name
	if(req.body.name) {
		try {
			if(!this.model.validateName(req.body.name)) {
				throw new Error('Name is not valid')
			}
			communityData.name = req.body.name
		} catch ({message}) {
			validationError.addContext('name', message)
		}
	}

	// description
	if(req.body.description) {
		try {
			if(!this.model.validateDescription(req.body.description)) {
				throw new Error('Description is not valid')
			}
			communityData.description = req.body.description;
		} catch ({message}) {
			validationError.addContext('description', message)
		}
	}

	// prefix
	if(req.body.prefix) {
		try {
			if(!this.model.validatePrefix(req.body.prefix)) {
				throw new Error('This subdomain is not valid')
			}
			communityData.prefix = req.body.prefix;
		} catch ({message}) {
			validationError.addContext('prefix', message)
		}
	}

	if(req.body.hasOwnProperty('isPrivate')) {
		communityData.isPrivate = !!isPrivate;
	}

	if(req.body.hasOwnProperty('memberVerification')) {
		communityData.memberVerification = !!memberVerification;
	}

	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		let community = await this.model.findByCode(id);
		if(!community) {
			const notFoundError = new ResponseError(404, 'Community does not exists')
			return res.send(notFoundError)
		}

		Object.assign(community, communityData)
		await community.save();

		return res.send(community)
	} catch(err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}

}

controller.deleteFunc = async function (req, res) {
	const { id } = req.params;

	try {
		let community = this.model.findByCode(id);
		let deleteRows = await this.delete(community.id)
		return res.send(deleteRows)
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

module.exports = controller;
