'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('folder');
const fs = require('fs');
const path = require('path');
const dir = "./upload/";

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
	    payload: [data], 


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

    const { id_reference_location, name } = req.body;

    const find_reference = await this.db.reference_location.findOne({
	where: {id: id_reference_location},
	attributes: ['reference'],
    });


    const current_directory = dir+find_reference.reference+"/"+name; 
    console.log('-----------------',current_directory)




    try {
	if ( fs.existsSync(current_directory) ) throw new Error ('directory already exists');
	let newdata = await this.insert({
	    id_reference_location,
	    name
	});
	if (newdata) {
	    if(name) fs.mkdirSync(current_directory);
	    return this.response({
		res,
		statusCode: 201,
		payload: [newdata]
	    });
	}
    } catch (error) {

	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: error.message,
	});
    }
}


controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, location, active, return_data } = req.body;

    console.log(dir+"one",dir+"otro")
    fs.renameSync(dir+"one",dir+"otro");
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
/*	
	const find_repository = await this.db.repository.findOne({
	    where: {id},
	    attributes: ['location'],
	});
	console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
	console.log(id);
	console.log(dir+find_repository.location);
	console.log(fs);
	fs.rmdirSync(dir+find_repository.location,{ recursive: true })
*/	
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
