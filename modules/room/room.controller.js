'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('room');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

const validAttributes = ['id', 'name', 'description', 'active', 'eventId', 'isOnline', 'maxCapacity', 'name', 'urlClassroom'];

controller.getRoomsByEvent = async function (req, res) {
	const { limit, offset } = req.query;

	try {
		let rooms = await this.model.findAll({
			where: {
				eventId: req.event.id
			},
			attributes: validAttributes,
			limit,
			offset
		})
		return res.send(rooms)
	} catch {
		const connectionError = new ResponseError(503, 'Try again later');
		return res.send(connectionError)
	}
}

controller.getOne = async function (req, res) {
	const { roomId } = req.params;

	try {
		const room = await this.model.findByPk(roomId, {
			attributes: validAttributes
		})
		return res.send(room)
	} catch {
		const connectionError = new ResponseError(503, 'Try again later')
		return connectionError
	}
}

controller.postFunc = async function (req, res) {

	const {
		name, // required
		description, // required
		isOnline, // required
		maxCapacity,
		urlClassroom, // required if isOnline is true
		active,
	} = req.body;

	const data = {
		name,
		description,
		isOnline: Boolean(isOnline),
		maxCapacity,
		active,
		eventId: req.event.id
	};

	const validationError = new ResponseError(400)

	try {
		if (!this.model.validateName(name)) {
			throw new Error('Name is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('name', message)
	}

	try {
		if (!this.model.validateDescription(description)) {
			throw new Error('Description is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('description', message)
	}

	try {
		if (!this.model.validateMaxCapacity(maxCapacity)) {
			throw new Error('Capacity is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('maxCapacity', message)
	}

	if(isOnline) {
		try {
			if (!this.model.validateUrlClassroom(urlClassroom)) {
				throw new Error('URL for classroom is not valid')
			}
			data.urlClassroom = urlClassroom
		} catch ({ message }) {
			validationError.addContext('urlClassroom', message)
		}
	}

	if(validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		let newdate = await this.insert(data);
		res.statusCode = 201;
		return res.send(newdate)
	} catch (error) {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.putFunc = async function (req, res) {
	const { roomId } = req.params;

	const data = {};

	const validationError = new ResponseError(400)

	if(req.body.name) {
		try {
			if (!this.model.validateName(req.body.name)) {
				throw new Error('Name is not valid')
			}
			data.name = req.body.name
		} catch ({ message }) {
			validationError.addContext('name', message)
		}
	}


	if(req.body.description) {
		try {
			if (!this.model.validateDescription(req.body.description)) {
				throw new Error('Description is not valid')
			}
			data.description = req.body.description
		} catch ({ message }) {
			validationError.addContext('description', message)
		}
	}

	if(req.body.maxCapacity) {
		try {
			if (!this.model.validateMaxCapacity(req.body.maxCapacity)) {
				throw new Error('Capacity is not valid')
			}
			data.maxCapacity = req.body.maxCapacity
		} catch ({ message }) {
			validationError.addContext('maxCapacity', message)
		}
	}

	if(req.body.hasOwnProperty('isOnline')) {
		data.isOnline = !!req.body.isOnline
	}

	if(req.body.hasOwnProperty('active')) {
		data.active = !!req.body.active
	}

	if(req.body.isOnline && req.body.urlClassroom) {
		try {
			if (!this.model.validateUrlClassroom(req.body.urlClassroom)) {
				throw new Error('URL for classroom is not valid')
			}
			data.urlClassroom = urlClassroom
		} catch ({ message }) {
			validationError.addContext('urlClassroom', message)
		}
	}
	try {
		let result = await this.update({
				id: roomId,
				data
		});
		return res.send(result)
	} catch (error) {
		this.response({
			res,
			success: false,
			statusCode: 500,
			message: 'something went wrong'
		});
	}
}



controller.deleteFunc = async function (req, res) {
	const { roomId } = req.params;

	try {
		let deleterows = await this.delete(roomId);
		return res.send(deleterows)
	} catch (error) {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


module.exports = controller;