'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('speaker');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/


controller.getFunc = async function (req, res) {

	const { id } = req.params;
	const { limit, offset, order, attributes, extended_data } = req.body;
	let modelstoextended = extended_data ? "[{model: this.db.user, as: 'user'},{ model: this.db.event, as: 'event' }, { model: this.db.state, as: 'state'}]" : "";
	try {
		const data = await this.getData({
			id,
			limit,
			offset,
			attributes,
			order,
			modelstoextended,
		});
		this.response({
			res,
			payload: [data]
		});
	} catch (error) {
		this.response({
			res,
			success: false,
			statusCode: 500,
			message: 'something went wrong',
		});
	}

}

controller.getSpeakersByEvent = async function (req, res) {
	const { id_event } = req.params;

	try {
		const data  = await this.model.findAll({
			attributes: ['id'],
			where: { id_event },
			include: [{
				attributes:['name', 'last_name'],
				model: this.db.user,
				as: 'user'
			},
			{
				attributes: ['name', 'description', 'blocker'],
				model: this.db.state,
				as: 'state',
				where: {
					active : true
				}
			}
		]
		});
		console.log(data);
		this.response({
			res,
			payload: [data]
		});

	} catch (error) {
		this.response({
			res,
			success: false,
			statusCode: 500,
			message: 'something went wrong',
		});

	}
	
}

controller.postFunc = async function (req, res) {

	const { id_user, id_event, id_state } = req.body;
	try {
		let newdate = await this.insert({
			id_user, id_event, id_state
		});
		if (newdate) {
			return this.response({
				res,
				statusCode: 201,
				payload: [newdate]
			});
		}
	} catch (error) {
		this.response({
			res,
			success: false,
			statusCode: 500,
			message: 'something went wrong',
		});
	}
}



controller.putFunc = async function (req, res) {
	const { id } = req.params;
	const { id_user, id_event, id_state, return_data } = req.body;
	try {
		let result = await this.update(
			{
				id,
				data: {
					id_user, id_event, id_state
				},
				return_data
			});
		if (result) {
			return this.response({
				res,
				statusCode: 200,
				payload: return_data ? result : []
			});
		} else {
			this.response({
				res,
				success: false,
				statusCode: 202,
				message: 'Could not update this element, possibly does not exist'
			});
		}
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
	const { id } = req.params;
	try {
		let deleterows = await this.delete({ id });
		if (deleterows > 0) {
			return this.response({
				res,
				success: true,
				statusCode: 200
			});
		} else {
			this.response({
				res,
				success: false,
				statusCode: 202,
				message: 'it was not possible to delete the item because it does not exist'
			});
		}
	} catch (error) {
		this.response({
			res,
			success: false,
			statusCode: 500,
			message: 'something went wrong'
		});
	}
}


module.exports = controller;