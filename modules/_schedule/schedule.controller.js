const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('schedule');
const moment = require('moment');

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
	    payload: { data }

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

    const { id_user, id_community, id_event, time_zone } = req.body;
    try {
	let newdata = await this.insert({
	    id_user, 
	    id_community,
	    id_event,
	    time_zone
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
    const { id_user, id_community, id_event, time_zone } = req.body;

    try {

	let result = await this.update(
	    {
		id,
		data: {
		    id_user, 
		    id_community,
		    id_event,
		    time_zone
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
	    message: error.message
	});
    }

}

module.exports = controller;
