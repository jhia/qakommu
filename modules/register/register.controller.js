'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('register');

controller.postFunc = async function (req, res) {
	const {user_type,user,community} = this.db

	const { name, last_name, username, address, email, password, gender, id_repository, id_role, id_community,code } = req.body

		try {

			const data = await community.findOne({
				attributes: ['name'],
			},{
				where: {
					code
				}

			});

			let result = await user.create(
			{
				name,
				last_name,
				username,
				address,
				email,
				password,
				gender,
				id_repository,
				id_role,
				id_community,
				data
			});

			await user_type.create(
				{
					id_user: result.id,
					id_role: id_role,
					id_community: id_community
				});

			if(result)
			{
				res.status(200).json({
					message: "successful action",

					result,
					your_community: data

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