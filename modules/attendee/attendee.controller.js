'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('attendee');
//const { validateEmail } = require('../../helpers/utilities');
const { ResponseError } = require('../../http');


/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getFunc = async function (req, res) {

    const { limit, offset, event } = req.query;
    
    if (isNaN(event)) {
        const validationError = new ResponseError(400, 'event is not valid')
        return res.send(validationError);
    }

    try {
        let attendees = await this.model.findAll({
            limit,
            offset,
            //attributes: ['id','firstName', 'lastName', 'email', 'userId', 'isPresent', 'eventId'],
            where: {eventId : event }
        });

        res.send(attendees);        

    } catch ({ message }) {
        console.log(message)
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }

}


controller.getOne = async function (req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
        const validationError = new ResponseError(400, 'Attendee id is not valid')
        return res.send(validationError);
    }

    try {
        const attendee = await this.model.findByPk(id, {
            attributes: ['id','firstName', 'lastName', 'email', 'eventId', 'isPresent'],
        });
        return res.send(attendee);
    } catch {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }

}



controller.postFunc = async function (req, res) {
    const { 
        firstName, // required
        lastName, // required
        email, // required
        user, 
        isPresent,
        event, // required
        //ticketSaleDetailId  // required
    } = req.body;

    const validationError = new ResponseError(400);

    let attendeeData = {
        firstName,
        lastName,
        email,
        userId: user,
        isPresent,
        eventId : event,
    }

    //first name
    try{    
        if(!this.model.validateFirstName(firstName)){
            throw new Error('First Name is not valid')
        }
    }catch({message}){
        validationError.addContext('firstName', message)
    }

    //last name
    try{    
        if(!this.model.validateLastName(lastName)){
            throw new Error('Last Name is not valid')
        }
    }catch({message}){
        validationError.addContext('lastName', message)
    }

    // email
	try {
		if (!this.model.validateEmail(email)) {
			validationError.addContext('email', 'Email is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('email', message)
	}

    //event exists
    try {
        if(!(await this.db.event.exists(event))) {
            throw new Error('This event does not exists')
        }
    } catch ({message}) {
        validationError.addContext('event', message)
    }

    // validate all
    if(validationError.hasContext()){
        return res.send(validationError)
    }

    //insert
    try {
       
        let result = await this.insert(attendeeData);
        res.statusCode = 201;
        res.send(result);
        
    } catch (err) {
        console.error(err);
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const idError = new ResponseError(400, 'Attendee id is not valid')
        return res.send(idError);
    }

    const validationError = new ResponseError(400, 'Attendee id is not valid')

    let attendeeData = {};
    //first name
    if(req.body.firstName){
        try{
            if(!this.model.validateFirstName(req.body.firstName)){
                throw new Error('First name is not valid');
            }
            attendeeData.firstName = req.body.firstName
        }catch({message}){
            validationError.addContext('firstName', message);
        }
    }
    //last name
    if(req.body.lastName){
        try{
            if(!this.model.validateLastName(req.body.lastName)){
                throw new Error('Last name is not valid');
            }
            attendeeData.lastName = req.body.lastName
        }catch({message}){
            validationError.addContext('lastName', message);
        }
    }

    //email
    if(req.body.email){
        try {
            if (!this.model.validateEmail(req.body.email)) {
                validationError.addContext('email', 'Email is not valid')
            }
            attendeeData.email = req.body.email
        } catch ({ message }) {
            validationError.addContext('email', message)
        }
    }
    
    
    // validate all
    if(validationError.hasContext()){
        return res.send(validationError)
    }
    
    //update
    try {
        
        let result = await this.update({
			id: req.params.id,
            data: attendeeData
        });

        return res.send([]);

    } catch (error) {
        console.log(error.message);
        const connectionError = new ResponseError(503, 'Try again later');
        res.send(connectionError);
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.body;
    let length = id.length;

    //validate 
    for(let i = 0; i<length; i++){
        if(isNaN(id[i])) {
            const validationError = new ResponseError(400, 'Attendee id is not valid')
            return res.send(validationError);
        }
    }

    //delete
    try {

        let rows = await this.model.destroy({ where: { id } })
        return res.send(rows);

    } catch (error) {
        console.warn(error.message);
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

//--------------------special functions--------------------
/*
controller.getSessionsByAttendee = async function (req, res) {
    const { id } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.session_attendee.findAll({
            limit,
            offset,
            attributes: ['id'],
            order,
            where: { id_attendee: id },
            include: [{
                attributes: ['name', 'description', 'order', 'start', 'end', 'is_break'],
                model: this.db.session,
                as: 'session',
                include: [{
                    attributes: ['name', 'description'],
                    model: this.db.room,
                    as: 'room'
                }]
            }]
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
*/
module.exports = controller;