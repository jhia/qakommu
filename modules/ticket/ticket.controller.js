'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('ticket');

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
		res.json({
			data
		});
	} catch (error) {
		res.status(500).json({
			message: 'something went wrong',
			data: {}
		})
	}

}


controller.postFunc = async function (req, res) {

    const { name, description, id_state, id_event, is_private, base_price, quantity_total, quantity_current, reserved, max_ticket_sell, min_ticket_sell } = req.body;
    console.log(name);
    console.log(id_state);
	try {
		let newdate = await this.insert({
			name, description, id_state, id_event, is_private, base_price, quantity_total, quantity_current, reserved, max_ticket_sell, min_ticket_sell
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
	const { name, description, id_state, id_event, is_private, base_price, quantity_total, quantity_current, reserved, max_ticket_sell, min_ticket_sell } = req.body;
	try {
		let result = await this.update(
			{
				id
			},
			{
				name, description, id_state, id_event, is_private, base_price, quantity_total, quantity_current, reserved, max_ticket_sell, min_ticket_sell
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