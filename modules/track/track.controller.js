'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');
const controller = new Base('track');

const validAttributes = ['id', 'name', 'description', 'active', 'communityId', 'icon'];
controller.getTracksForCommunity = async function (req, res) {
	const { limit, offset } = req.query;
	try {
		const tracks = await this.model.findAll({
			limit,
			offset,
			attributes: validAttributes,
			where:{
				communityId: req.community.id
			}
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
		const track = await this.model.findByPk(id,{
			attributes: validAttributes,
		})
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
	} = req.body; // everything is required
	
	const trackData ={
		name,
		description,
		active,
		icon,
		communityId: req.community.id,
		hidden: false
	}
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

	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		let track = await this.insert(trackData, { returning: validAttributes});

		res.statusCode = 201;
		return res.send(track);
	} catch (err) {
		console.log(err)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.putFunc = async function (req, res) {
	//const { id } = req.params;

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


	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		let result = await this.update(
			{
				id: req.track.id,
				data: trackData,
				returning: validAttributes
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

	try {
		let rows = await this.delete(req.track.id);
		return res.send(rows)
	} catch (error) {
		console.log(error.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


module.exports = controller;