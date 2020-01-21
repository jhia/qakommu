'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('state');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getFunc = async function (req, res) {

	const { id } = req.params;
	const {limit, offset, order, attributes} = req.body;
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
	//get body 
	const { name, description, active, blocker } = req.body;
	try {
		let newState = await this.insert({
			name,
			description,
			active,
			module_name: this.moduleName,
			blocker
		});
		if (newState) {
			return res.status(200).json({
				message: 'successful action',
				date: newState
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'something went wrong',
			date: {}
		});
	}
}

module.exports = controller;