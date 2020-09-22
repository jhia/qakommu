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
		});
	}

}

controller.postFunc = async function (req, res) {

	const { name, description, active, id_module_name, blocker } = req.body;
	try {
		let newdate = await this.insert({
			name,
			description,
			active,
			id_module_name,
			blocker
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
	const { name, description, active, id_module_name, blocker, return_data } = req.body;
	try {
		let result = await this.update(
			{
				id,
				data: {
					name,
					description,
					active,
					id_module_name,
					blocker
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

/* ---------- special functions ---------- */

controller.getDataByModuleName = async function(req, res){
	const { id } = req.params;
	const { limit, offset, order } = req.body;
	try {
		const data = await this.db.state.findAll({
            limit,
			offset,
			attributes: ['id', 'name', 'description', 'active', 'blocker'],
            order,
            where: { id_module_name: id, active: true }
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


module.exports = controller;