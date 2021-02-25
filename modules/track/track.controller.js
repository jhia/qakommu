'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');
const controller = new Base('track');

controller.getTracksForCommunity = async function (req, res) {
	const { limit, offset } = req.query;
	try {
		const tracks = await this.model.findByCommunity(req.community.id, {
			limit,
			offset
		});
		return res.send(tracks)
	} catch (err) {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.getTracksForEvent = async function (req, res) {
	try {
		let { tracks } = await this.db.event.findByPk(req.event.id, {
			include: [this.db.event.associations.track],
		})
		return res.send(tracks)
	} catch (err) {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.getOne = async function (req, res) {
	const { id } = req.params;

	try {
		const track = await this.model.findByPk(id)
		if(!track) {
			const notFoundError = new ResponseError(404, 'Track does not exist');
			return res.send(notFoundError)
		}

		return res.send(track)
	} catch {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


controller.postFunc = async function (req, res) {
	const {
		name,
		description,
		active,
		icon,
		community
	} = req.body; // everything is required

	const validationError = new ResponseError(400)

	try {
		if(!this.model.validateName(name)) {
			throw new Error('Name is not valid')
		}
	} catch ({message}) {
		validationError.addContext('name', message)
	}

	try {
		if(!this.model.validateDescription(description)) {
			throw new Error('Description is not valid')
		}
	} catch ({message}) {
		validationError.addContext('description', message)
	}

	try {
		if(!this.model.validateIcon(icon)) {
			throw new Error('Icon is not valid')
		}
	} catch ({message}) {
		validationError.addContext('icon', message)
	}

	try {
		if(!(await this.db.community.exists(community))) {
			throw new Error('Community is not valid')
		}
	} catch ({message}) {
		validationError.addContext('community', message)
	}

	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		let track = await this.insert({
			name,
			description,
			active,
			icon,
			communityId: community,
			hidden: false
		});

		res.statusCode = 201;
		return res.send(track);
	} catch (err) {
		console.log(err)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.putFunc = async function (req, res) {
	const { id } = req.params;

	const validationError = new ResponseError(400)

	let trackData = {};

	if(req.body.name) {
		try {
			if(!this.model.validateName(req.body.name)) {
				throw new Error('Name is not valid')
			}
			trackData.name = req.body.name;
		} catch ({message}) {
			validationError.addContext('name', message)
		}
	}

	if(req.body.description) {
		try {
			if(!this.model.validateDescription(req.body.description)) {
				throw new Error('Description is not valid')
			}
			trackData.description = req.body.description;
		} catch ({message}) {
			validationError.addContext('description', message)
		}
	}

	if(req.body.icon) {
		try {
			if(!this.model.validateIcon(req.body.icon)) {
				throw new Error('Icon is not valid')
			}
			trackData.icon = req.body.icon;
		} catch ({message}) {
			validationError.addContext('icon', message)
		}
	}

	if(req.body.hasOwnProperty('active')) {
		trackData.active = !!req.body.active;
	}

	// TODO review this validation, it should not move between communities
	if(req.body.community) {
		try {
			if(!(await this.db.community.exists(req.body.community))) {
				throw new Error('Community is not valid')
			}
			trackData.communityId = req.body.community;
		} catch ({message}) {
			validationError.addContext('community', message)
		}
	}

	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		let result = await this.update(
			{
				id,
				data: trackData
			}
		);
		return res.send(result);
	} catch (error) {
		console.log(error.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.deleteFunc = async function (req, res) {
	const { id } = req.params;
	if(isNaN(id)) {
		const validationError = new ResponseError(400, 'Track id is not valid')
		return res.send(validationError)
	}

	try {
		let rows = await this.delete({ id });
		return res.send(rows)
	} catch (error) {
		console.log(error.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


module.exports = controller;