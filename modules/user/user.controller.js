'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('user');
const { makeid } = require('../../helpers/utilities')

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
			payload: {
				id: data.id,
				name: data.name,
				last_name: data.last_name,
				username: data.username,
				profile_photo: "http://"+req.host+":8000/uploads/"+data.profile_photo,
				address: data.address,
				email: data.email,
				password: data.password,
				active: data.active,
				gender: data.gender,
				id_repository: data.id_repository,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt
			}
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
	const {user_type} = this.db

	const { name, last_name, username, address, email, password, gender, id_repository, id_rol, id_community } = req.body
		try {
			const result = await this.db[this.moduleName].create(
			{
				name,
				last_name,
				username,
				profile_photo,
				address,
				email,
				password,
				gender,
				id_repository,
				id_rol,
				id_community
			});

			await user_type.create({
					id_user: result.id,
					id_rol: id_rol,
					id_community: id_community
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
	const { name, last_name, username, address, email, password, gender, id_repository, id_rol, id_community, return_data } = req.body;

	const avatar = req.files.avatar;
	const profile_photo = "profile_photo"+"_"+makeid(6)+"."+avatar.name.split(".")[avatar.name.split(".").length-1]
	avatar.mv("./community_name/"+profile_photo);


    await this.update(
        {
            id,
            data: {
				name,
				last_name,
				username,
				profile_photo,
				address,
				email,
				password,
				gender,
				id_repository,
				id_rol,
				id_community
			},
            return_data
        })
        .then(( result )=>{
        this.response({
            res,
            statusCode: 200,
            payload: return_data ? result : []
        })
        }).catch((err)=>{
            this.response({
                res,
                success: false,
                statusCode: 500,
                message: err.message
            })
        });
}

controller.deleteFunc = async function (req, res) {
	const { id } = req.params;
	try {
		let deleterows = await this.delete({ id });
		console.log(deleterows);
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