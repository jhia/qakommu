'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('activity');
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

    const { title, description, start, end, color, email_notification, pre_notification, location, time_zone, repetition, id_schedule } = req.body;
    const {activity,schedule,activity_schedule, Sequelize} = this.db;

    const st = moment(start, 'DD/MM/YYYY HH:mm:ss');
    const en = moment(end, 'DD/MM/YYYY HH:mm:ss');
    const valid_range = en.diff(st,'minutes');
    const Op = Sequelize.Op;

    try {

	if(!st.isValid() ||  !en.isValid()) throw new Error ('Error, the format is DD/MM/YYYY HH:mm:ss');
	if ( valid_range < 0 ) throw new Error ('Error in range');

	const schedule_exist = await this.db.schedule.count({
	    where: { id: id_schedule }
	});

	if ( schedule_exist == 0 )  throw new Error ('Not exist schedule');

	const ACCEPT_FORMAT = 'YYYY-MM-DD hh:mm:ss'
	const start_date = moment.utc(start, ACCEPT_FORMAT)
	const end_date = moment.utc(end, ACCEPT_FORMAT)

	let schedule_clash = await this.db.activity.count({
	    where: {
		[Op.or]: [
		    { 
			start: { [Op.between]: [start_date, end_date] }
		    },
		    { 
			end: { [Op.between]: [start_date, end_date] }
		    },	
		]
	    }
	});

	if (schedule_clash > 0 ) throw new Error ('Shedule clash');

	let newdata = await this.insert({
	    title, 
	    description, 
	    start: start_date, 
	    end: end_date, 
	    color, 
	    email_notification, 
	    pre_notification, 
	    location, 
	    time_zone, 
	    repetition,
	});

	await newdata.addSchedule(id_schedule);

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
    const { title, description, start, end, color, email_notification, pre_notification, location, time_zone, repetition, id_schedule } = req.body;

    try {

	let result = await this.update(
	    {
		id,
		data: {
		    title, 
		    description, 
		    start, 
		    end, 
		    color, 
		    email_notification, 
		    pre_notification, 
		    location, 
		    time_zone, 
		    repetition

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
