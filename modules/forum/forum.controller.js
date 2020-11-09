'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('forum');

controller.getFunc = async function (req, res) {

    const { id, time } = req.params;
    const { limit, offset, order, attributes } = req.body;
    try {
	const data = await this.getData({
	    id,
	    limit,
	    offset,
	    attributes,
	    order
	});
	return this.response({
	    res,
	    payload: { data }
	});
    } catch (error) {
	return this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: error.message,
	});
    }

}


controller.postFunc = async function (req, res) {

    const { id_community, id_user, name, description, public_topic } = req.body;
    try {
	let newdata = await this.insert({
	    id_community, 
	    id_user, 
	    name, 
	    description, 
	    public_topic
	});
	if (newdata) {
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
    const { id_community, id_user, name, description, public_topic, return_data } = req.body;
    await this.update(
	{
	    id,
	    data: {
		id_community, 
		id_user, 
		name, 
		description, 
		public_topic
	    },
	    return_data
	}            
    )
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
	    message: error.message
	});
    }

}

module.exports = controller;
