'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('sponsor');
const Archive = require('../../helpers/archive');
const { ResponseError } = require('../../http');
const { sponsorTypeVerification } = require('../../middleware/verification');
/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getSponsorsByEvent = async function (req, res) {
	const { limit, offset } = req.query;
	try {
		const data = await this.model.findAll({
			where: {
				eventId: req.event.id
			},
			limit,
			offset,
			attributes: ['id', 'description', 'active','image'],
			include: [
				{
					model: this.db.sponsorType,
					attributes: ['id','name','description','contributionValue','active','displayNumber'],
					as: 'type'
				},
				{
					model: this.db.partnership,
					attributes: ['id','name', 'description', 'logo', 'web', 'active'],
					as: 'partnership'
				}
			]
				 
		});
		return res.send(data)

	} catch (error) {
		console.log(error)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}



controller.getOne = async function (req, res) {
	const { id } = req.params;

	if (isNaN(id)) {
		let idError = new ResponseError(400, 'Session id is not valid')
		return res.send(idError)
	}

	try {
		const data = await this.model.findByPk(id, {
			attributes: ['id', 'description', 'active','image'],
			include: [
				{
					model: this.db.sponsorType,
					attributes: ['id','name','description','contributionValue','active','displayNumber'],
					as: 'type'
				},
				{
					model: this.db.partnership,
					attributes: ['id','name', 'description', 'logo', 'web', 'active'],
					as: 'partnership'
				}
			]
		});
		return res.send(data)
	} catch (error) {
		const connectionError = new ResponseError(503, 'Try again later')
	}
}

controller.postFunc = async function (req, res) {

	const {
		description,
		event,
		partnership,
		sponsorType,
		active
	} = req.body;
	
	const data = {
		description,
		eventId: event,
		partnershipId: partnership,
		sponsorTypeId: sponsorType,
		active
	}


	const validationError = new ResponseError(400)

	// description
	try {
		if (!this.model.validateDescription(description)) {
			throw new Error('Description is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('description', message)
	}

	try {
		if (!(await this.db.event.exists(event))) {
			throw new Error('Event does not exist')
		}
	} catch ({ message }) {
		validationError.addContext('event', message)
	}

	try {
		if (!(await this.db.partnership.exists(partnership))) {
			throw new Error('Partner does not exist')
		}
	} catch ({ message }) {
		validationError.addContext('partnership', message)
	}

	try {
		if (!(await this.db.sponsorType.exists(sponsorType))) {
			throw new Error('Sponsor type does not exist')
		}
	} catch ({ message }) {
		validationError.addContext('sponsorType', message)
	}

	if (validationError.hasContext()) {
		return res.send(validationError)
	}

	try {
		if (req.files && req.files.image) {
			let image = new Archive('sponsor', req.files.image)
			await image.upload()
			data.image = image.id;
		}

		let newdate = await this.insert(data);
		res.statusCode = 201;
		return res.send(newdate);
	} catch (error) {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


controller.putFunc = async function (req, res) {
	const { id } = req.params;

	if (isNaN(id)) {
		let idError = new ResponseError(400, 'Sponsor id is not valid')
		return res.send(idError)
	}

	const data = {};
	const validationError = new ResponseError(400)

	
	// description
	if (req.body.description) {
		
		try {
			if (!this.model.validateDescription(req.body.description)) {
				throw new Error('Description is not valid')
			}
			data.description = req.body.description
		} catch ({ message }) {
			validationError.addContext('description', message)
		}
	}

	if (req.body.partnership) {
		try {
			if (!(await this.db.partnership.exists(req.body.partnership))) {
				throw new Error('Partner does not exist')
			}
			data.partnershipId = req.body.partnership
		} catch ({ message }) {
			validationError.addContext('partnership', message)
		}
	}

	if (req.body.sponsorType) {
		try {
			if (!(await this.db.sponsorType.exists(req.body.sponsorType))) {
				throw new Error('Sponsor type does not exist')
			}
			data.sponsorTypeId = req.body.sponsorType
		} catch ({ message }) {
			validationError.addContext('sponsorType', message)
		}
	}

	if (req.body.hasOwnProperty('active')) {
		data.active = Boolean(req.body.active)
	}

	if (validationError.hasContext()) {
		return res.send(validationError)
	}

	try {

		let updatePicture = false;
		let previousImageName = null;
		if (req.files && req.files.image) { // there's image
			let image = new Archive('sponsor', req.files.image); // let the handler do it
			await image.upload() // save image
			data.image = image.id;
			updatePicture = true;
		}

		if (updatePicture) {
			let r = await this.model.findByPk(id, { attributes: ['image'] })
			previousImageName = r.image;
		}

		const rows = await this.update({
			id,
			data
		});

		if (rows > 0 && data.hasOwnProperty('image') && updatePicture) {
			await (await Archive.fromString(previousImageName)).remove();
		}
		

		return res.send([])
	} catch (err) {
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}

}


controller.deleteFunc = async function (req, res) {
	try {
		if(req.sponsor.image){
			await (await Archive.fromString(req.sponsor.image)).remove();
		}
		let deleterows = await this.delete(req.sponsor.id); 
		return res.send(deleterows)
	} catch (error) {
		console.log(error)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


module.exports = controller;