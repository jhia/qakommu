'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('user');
const { makeid, verify_and_upload_image_put, delete_image } = require('../../helpers/utilities')

const fs = require('fs');

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
				profile_photo: data.profile_photo ? req.headers.host+data.profile_photo : null,
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
	const { name, last_name, username, address, email, password, gender, id_repository, id_rol, id_community, return_data, remove_image } = req.body;

	let find_image = await this.db.user.findOne({
		where: { id }
	});

	const fnd_image = find_image ? find_image.profile_photo : null
	const avatar = req.files ? req.files.avatar : null;
	const rm_image = remove_image ? remove_image : '0';

	const profile_photo = verify_and_upload_image_put( avatar, "profile_photo", fnd_image, rm_image );

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

	let find_image = await this.db.user.findOne({
		where: { id }
	});
	 
	delete_image( find_image.profile_photo.split("/")[2] );
	
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