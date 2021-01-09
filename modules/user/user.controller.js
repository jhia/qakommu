'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('user');
const jwt = require('jsonwebtoken');
const { makeid, verify_and_upload_image_put, upload_images,  delete_image, dynamic_host } = require('../../helpers/utilities')

const fs = require('fs');

controller.getFunc = async function (req, res) {

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secret');
    const id = decoded.user_id;

    let find_role = await this.db.user_type.findOne({
	where: { id_user: id },
	attributes : ["id_role"]
    });

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
		id_role: find_role.id_role,
		id_community: decoded.community_id,
		name: data.name,
		last_name: data.last_name,
		username: data.username,
		birthdate: data.birthdate,
		profile_photo: data.profile_photo ? dynamic_host(req) + "/uploads/"+data.profile_photo : null,
		host: data.host,
		type: data.type,
		country: data.country,
		city: data.city,
		address: data.address,
		country_code: data.country_code,
		zip_code: data.zip_code,
		phone: data.phone,
		email: data.email,
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
	    //message: 'something went wrong',
	    message: error.message
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
		phone,
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

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secret');
    const id = decoded.user_id;
    const { name, last_name, username, type, organization, country, city, zip_code, address, country_code, phone, birthdate, email, password, gender, id_repository, id_role, return_data, remove_image } = req.body;

    let find_image = await this.db.user.findOne({
	where: { id }
    });

    const fnd_image = find_image.profile_photo ? find_image.profile_photo : null;
    const avatar = req.files ? req.files.avatar : undefined;
    let profile_photo = avatar && verify_and_upload_image_put(avatar, "profile_photo", fnd_image);
    if(req.body.avatar == 'not-image') profile_photo = null;
    const archive = profile_photo ? profile_photo.split("_") : null;

    try {

	let result = await this.update(
	    {
		id,
		data: {
		    name,
		    last_name,
		    username,
		    profile_photo,
		    type,
		    country,
		    city,
		    address,
		    country_code,
		    phone,
		    email,
		    password,
		    gender,
		    id_repository,
		    id_role,
		    id_community:decoded.community_id
		},
		return_data
	    });
	if (result) {
	    if(fnd_image && profile_photo) delete_image(fnd_image);
	    if(req.body.avatar == 'not-image' && fnd_image) delete_image(fnd_image);
	    if(profile_photo) upload_images( avatar, archive[0]+"_"+archive[1], archive[2].split(".")[0]);

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
	    message: error.message 
	});
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.params;
    let find_image = await this.db.user.findOne({
	where: { id }
    });
    if (find_image.profile_photo) delete_image(find_image.profile_photo);
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
