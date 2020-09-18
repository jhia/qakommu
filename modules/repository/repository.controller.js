'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('repository');
const fs = require('fs');
const path = require('path');
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

    const { name, location, id_community, active } = req.body;
    try {
	const create_folder = fs.mkdirSync("upload/"+location);
	let newdata = await this.insert({
	    name,
	    location,
	    id_community,
	    active,
	});
	console.log(create_folder)
	if (newdata) {
	    //const create_folder = fs.mkdirSync("upload/"+newdata.location);
	    console.log("paso")
	    return this.response({
		res,
		statusCode: 201,
		payload: [newdata]
	    });
	}
    } catch (error) {

	let curDir="";
	if (error.code === 'EEXIST') { // curDir already exists!
	    curDir = " folder exists!"
	}



	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    //message: 'something went wrong',
	    message: error.message,
	});
    }
}


controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, location, active, return_data } = req.body;

    try {
	let result = await this.update(
	    {
		id,
		data: {
		    name,
		    location,
		    active
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

module.exports = controller;
