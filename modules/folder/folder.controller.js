'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('folder');
const fs = require('fs');
const path = require('path');
const dir = "./upload/";


controller.getFunc = async function (req, res) {

    const { id, id_repository } = req.params;
    const { limit, offset, order, attributes } = req.body;

    try {
	const data = id ?  
	    await this.db.folder.findOne({
		where: { id, id_repository },
	    })
	    : 
	    await this.db.folder.findAll({
		where: { id_repository },
	    })

	this.response({
	    res,
	    payload: [data], 
	});
    } catch (error) {
	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: error.message,
	});
    }

}

controller.postFunc = async function (req, res) {

    const { id_repository, name } = req.body;

    console.log('-------------',id_repository)
    const find_reference = await this.db.repository.findOne({
	where: {id: id_repository},
	attributes: ['location'],
    });


    const current_directory = dir+find_reference.location+"/"+name; 
    console.log('-----------------',current_directory)




    try {
	if ( fs.existsSync(current_directory) ) throw new Error ('directory already exists');
	let newdata = await this.insert({
	    id_repository,
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
	const find_folder = await this.db.folder.findOne({
	    where: {id},
	    attributes: ['id_repository','name'],
	});


	const find_reference = await this.db.repository.findOne({
	    where: {id: find_folder.id_repository},
	    attributes: ['location'],
	});

	console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	const current_dir = dir+find_reference.reference+"/"+find_folder.name;
	console.log(id);
	console.log(current_dir);
	fs.rmdirSync(current_dir,{ recursive: true })

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
