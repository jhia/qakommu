'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('room');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/


controller.getFunc = async function (req, res) {

	const { id } = req.params;
	const { limit, offset, order, attributes } = req.body;
	try {
		const data = await this.getData({
			id,
			limit,
			offset,
			attributes,
			order
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
		})
	}

}


controller.postFunc = async function (req, res) {

	const { name, description, max_capacity, active } = req.body;
	try {
		let newdate = await this.insert({
			name,
            description,
            max_capacity,
			active
		});
		if (newdate) {
			return res.status(200).json({
				message: 'successful action',
				date: newdate
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'something went wrong',
			date: {}
		});
	}
}

controller.putFunc = async function (req, res) {
	const { id } = req.params;
	const { name, description, max_capacity, active } = req.body;
	try {
		let result = await this.update(
			{
				id
			},
			{
				name,
                description,
                max_capacity,
				active
			});
			if(result)
			{
				res.status(200).json({
					message: "successful action"
				});
			}
	} catch (error) {
		res.status(500).json({
			message: 'something went wrong',
			date: {}
		});
	}
}

controller.deleteFunc = async function (req, res) {
	const { id } = req.params;
	try {
		let deleterows = await this.delete({ id });
		res.json({
			count: deleterows
		});
	} catch (error) {
		res.status(500).json({
			message: 'something went wrong'
		});
	}
}


module.exports = controller;