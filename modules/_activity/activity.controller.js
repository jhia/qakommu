'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('activity');
const moment = require('moment');
//const {schedule,activity_schedule, Sequelize} = this.db;

controller.getScheduleActivity = async function (req, res) {

    const { id,id_schedule } = req.params;
    const { limit, offset, order, attributes } = req.body;
    const { activity } = this.db;

    try {

	const data = id ?  
	    await this.db.activity.findOne({
		where: { id },
		include: [{
		    model: this.db.schedule,
		    as: 'schedules',
		    where: {
			id: id_schedule
		    },
		}]
	    })
	    : 
	    await this.db.activity.findAll({
		include: [{
		    model: this.db.schedule,
		    as: 'schedules',
		    where: {
			id: id_schedule
		    },
		}]
	    })

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

    const { title, description, start, end, color, email_notification, reminder, location, time_zone, repetition, id_schedule } = req.body;

    const st = moment(start, 'DD/MM/YYYY HH:mm:ss');
    const en = moment(end, 'DD/MM/YYYY HH:mm:ss');
    const valid_range = en.diff(st,'minutes');
    const { Sequelize } = this.db;
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
	    reminder, 
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
    const { title, description, start, end, color, email_notification, reminder, location, time_zone, repetition, return_data } = req.body;

    const st = moment(start, 'DD/MM/YYYY HH:mm:ss');
    const en = moment(end, 'DD/MM/YYYY HH:mm:ss');
    const valid_range = en.diff(st,'minutes');
    const { Sequelize } = this.db;
    const Op = Sequelize.Op;

    try {

	if(!st.isValid() ||  !en.isValid()) throw new Error ('Error, the format is DD/MM/YYYY HH:mm:ss');
	if ( valid_range < 0 ) throw new Error ('Error in range');

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

	let result = await this.update(
	    {
		id,
		data: {
		    title, 
		    description, 
		    start: start_date, 
		    end: end_date, 
		    color, 
		    email_notification, 
		    reminder, 
		    location, 
		    time_zone, 
		    repetition,
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
	    //message: 'something went wrong'
	    message: error.message
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
