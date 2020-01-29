'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('user');

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
	const {user_type} = this.db

	const { name, last_name, username, address, email, password, gender, id_repository, id_rol, id_community } = req.body
		try {
			const result = await this.db[this.moduleName].create(
			{
				name,
				last_name,
				username,
				address,
				email,
				password,
				gender,
				id_repository,
				id_rol,
				id_community
			});

			await user_type.create(
				{
					id_user: result.id,
					id_rol: id_rol,
					id_community: id_community
				});

			if(result)
			{
				console.log(id_rol)

				res.status(200).json({
					message: "successful action"
				});
			}
	
		} catch (error) {
			console.log(error)
			res.status(500).json({
				message: 'something went wrong',
				date: {}
			});
		}
}

controller.putFunc = async function (req, res) {
	const { id } = req.params;
	const { name, description, active, module_name ,blocker } = req.body;
	try {
		let result = await this.update(
			{
				id
			},
			{
				name,
				description,
				active,
				module_name,
				blocker
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