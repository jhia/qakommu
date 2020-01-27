'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('register');

controller.postFunc = async function (req, res) {
	const {user_type,user} = this.db

	const { name, last_name, username, address, email, password, gender, id_repository, id_rol, id_community } = req.body
		try {
			const result = await user.create(
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

module.exports = controller;