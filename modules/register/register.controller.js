'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('register');
const { makeid } = require('../../helpers/utilities')
controller.postFunc = async function (req, res) {
	const {user_type,user,community} = this.db
	const { name, last_name, username, address, email, password, gender, id_repository, id_role, id_community, community_code, community_name} = req.body

	try {

		let data = []
		if (!community_name && !community_code) throw new Error("needs community")

		if (community_code) {
			data = await community.findOne({
				where: { code: community_code },
				attributes: ['id', 'name']
			});				
		}
		
		let query_user = await user.findOne({
			where: { email }
		});
	
		if (query_user) {
			throw new Error("Email exist")
		}

		if(community_name){
			data = await community.create({
				name: community_name,
				code: makeid(6)
			}); 			
		}		
		
		if (!data) {
			throw new Error("the code does not belong to any community!");
		}

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
			id_role
		});

		await user_type.create(
			{
				id_user: result.id,
				id_role: id_role,
				id_community: data['id']
			});

		if(result)
		{

			return this.response({
				res,
				statusCode: 201,
				message: "Created Successfully",
				payload: {
					result:{
						name,
						last_name,
						username,
						address,
						email,
						password,
						gender,
						id_repository,
						id_role,
						community: {
							id: data['id'],
							code: data['code'],
							name: data['name']
						}
					}
				}
			});


		}

	} catch (err) {

		return this.response({
			res,
			success: false,
			statusCode: 500,
			message: err.message,
		});
	}
}

module.exports = controller;