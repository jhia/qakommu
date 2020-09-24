'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('repository');
const fs = require('fs');
const path = require('path');
const dir = "./upload/";
/*
 *Extend or overwrite the base functions
 *All the controllers already have implicit the models by:
 *this.db -> All models
 *this.model -> Current module model
 */

const readdirSync = (p, a = []) => {

    if (fs.statSync(p).isDirectory()){
	a = [p];
	fs.readdirSync(p).map(f => readdirSync(a[a.push(path.join(p, f)) - 1], a));
    }

    return a
}


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

	const ir = readdirSync(dir+data.location);
	this.response({
	    res,
	    payload: {
		name: data.name,
		location: ir,
		community: data.id_community,
		active: data.active,
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

    const { name, location, id_community, active } = req.body;
    try {
	if ( fs.existsSync(dir+location) ) throw new Error ('directory already exists');
	let newdata = await this.insert({
	    name,
	    location,
	    id_community,
	    active,
	});
	if (newdata) {
	    if(location) fs.mkdirSync("upload/"+location);
	    return this.response({
		res,
		statusCode: 201,
		payload: [newdata]
	    });
	}
    } catch (error) {

	if( error.code == "EEXIST" ) error.message = "file already exists"
	if( !id_community ) error.message = "required community"
	if( !location ) error.message = "required location"

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
    const { name, location, id_community, active, return_data } = req.body;

    const find_repository = await this.db.repository.findOne({
	where: {id},
	attributes: ["location"]
    });
    console.log('-------------',find_repository.location)

    //fs.renameSync(dir+"one",dir+"otro");



    try {
        if ( location ) fs.renameSync(dir+find_repository.location, dir+location);

	let result = await this.update(
	    {
		id,
		data: {
		    name,
		    location,
		    id_community,
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
	const find_repository = await this.db.repository.findOne({
	    where: {id},
	    attributes: ['location'],
	});
	fs.rmdirSync(dir+find_repository.location,{ recursive: true })
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
	console.log('--------------',error.original.code)
	if (error.original.code == 23503) error.message = "this folder is not empty"
	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: error.message
	});
    }
}

module.exports = controller;
