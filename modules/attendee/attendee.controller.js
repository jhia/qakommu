'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('attendee');
//const { validateEmail } = require('../../helpers/utilities');
const { ResponseError } = require('../../http');
const Archive = require('../../helpers/archive')


/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

const validAttributes = ['id','firstName', 'lastName', 'email', 'eventId', 'isPresent']

controller.getFunc = async function (req, res) {

    const { limit, offset } = req.query;

    try {
        let attendees = await this.model.findAll({
            limit,
            offset,
            attributes: validAttributes,
            where: { eventId : req.event.id }
        });

        res.send(attendees);        

    } catch ({ message }) {
        console.log(message)
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }

}


controller.getCountFromAttendees = async function (req, res) {
    
    try {
        const count = await this.model.count({
            where: {
                eventId : req.event.id
            }
        })
        return res.send({ count });
    } catch (err) {
        console.log(err.message);
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

controller.getOneFromTicket = async function (req, res) {
    try {
        const attendee = this.model.findOne({
            where: {
                ticketSaleDetailId: req.ticketSaleDetail.id
            },
            attributes: validAttributes,
            include: [{
                model: this.db.user,
                attributes: ['firstName', 'lastName', 'username', 'profilePhoto'],
                as: 'user'
            }]
        })
        if(attendee.hasOwnProperty('user') && attendee.user.profilePhoto) {
            attendee.user.profilePhoto = await Archive.route(attendee.user.profilePhoto)
        }
        return res.send(attendee);
    } catch(err) {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

controller.getOne = async function (req, res) {
    const { attendeeId } = req.params;

    try {
        const attendee = await this.model.findByPk(attendeeId, {
            attributes: validAttributes,
            include: [{
                model: this.db.user,
                attributes: ['firstName', 'lastName', 'username', 'profilePhoto'],
                as: 'user'
            }],
        });

        if(attendee.hasOwnProperty('user') && attendee.user.profilePhoto) {
            attendee.user.profilePhoto = await Archive.route(attendee.user.profilePhoto)
        }
        return res.send(attendee);
    } catch(err) {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}



controller.postFunc = async function (req, res) {
    const { 
        firstName, // required
        lastName, // required
        email, // required
        isPresent,
        ticket  // required ticket sale detail uuid
    } = req.body;

    const validationError = new ResponseError(400);
    const connectionError = new ResponseError(503, 'Try again later');

    let attendeeData = {
        isPresent,
        eventId: req.event.id,
        email
    }

    try {
        let t = await this.db.ticketSaleDetail.findByUUID(ticket, {
            attributes: ['id']
        })
        if(!t) {
            validationError.addContext('ticket', 'Ticket does not exist')
            return res.send(validationError) // no more queries
        }
        if(await this.model.ticketAlreadyUsed(t.id)) {
            const alreadyInUseError = new ResponseError(400, 'Ticket already used')
            return res.send(alreadyInUseError)
        }
        attendeeData.ticketSaleDetailId = t.id
    } catch (ticketErr) {
        console.log(ticketErr);
        return res.send(connectionError)
    }

    let user;
    try {
        user = await this.db.user.findOne({ where:{ email }});
    } catch(userErr) {
        console.error(userEcoderr);
        return res.send(connectionError)
    }

    if(user) {
        attendeeData.userId = user.id;
        attendeeData.firstName = user.firstName;
        attendeeData.lastName = user.lastName;
    } else {
        //first name
        try{    
            if(!this.model.validateFirstName(firstName)){
                throw new Error('First Name is not valid')
            }
            attendeeData.firstName = firstName
        }catch({message}){
            validationError.addContext('firstName', message)
        }

        //last name
        try{    
            if(!this.model.validateLastName(lastName)){
                throw new Error('Last Name is not valid')
            }
            attendeeData.lastName = lastName
        }catch({message}){
            validationError.addContext('lastName', message)
        }

        // email
        try {
            if (!this.model.validateEmail(email)) {
                throw new Error('Email is not valid')
            }
            if((await this.model.count({
                where: {
                    email: attendeeData.email,
                    eventId: attendeeData.eventId
                }
            })) > 0) {
                throw new Error('Attendee already created')
            }
        } catch ({ message }) {
            validationError.addContext('email', message)
        }
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
        return res.send(connectionError);
    }
}

controller.postFromTicket = async function (req, res) {
    const { 
        firstName, // required
        lastName, // required
        email, // required
        isPresent,
    } = req.body;


    const validationError = new ResponseError(400);
    const connectionError = new ResponseError(503, 'Try again later');

    let attendeeData = {
        isPresent,
        ticketSaleDetailId: req.ticketSaleDetail.id,
        email
    }

    try {
        if(await this.model.ticketAlreadyUsed(req.ticketSaleDetail.id)) {
            const alreadyInUseError = new ResponseError(400, 'Ticket already used')
            return res.send(alreadyInUseError)
        }
    } catch {
        return res.send(connectionError)
    }

    try {
        let detail = await this.db.ticketSaleDetail.findByPk(req.ticketSaleDetail.id, {
            include: [
                {
                    model: this.db.ticketSale,
                    as: 'ticketSale',
                    attributes: ['id'],
                    include: [
                        {
                            model: this.db.ticket,
                            attributes: ['id'],
                            as: 'ticket',
                            include: [
                                {
                                    model: this.db.event,
                                    attributes: ['id'],
                                    as: 'event'
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        attendeeData.eventId = detail.ticketSale.ticket.event.id;
    } catch {
        return res.send(connectionError)
    }

    let user;
    try {
        user = await this.db.user.findOne({ where:{ email }});
    } catch({ message }) {
        return res.send(connectionError)
    }

    if(user) {
        attendeeData.userId = user.id;
        attendeeData.firstName = user.firstName;
        attendeeData.lastName = user.lastName;
    } else {
        //first name
        try{    
            if(!this.model.validateFirstName(firstName)){
                throw new Error('First Name is not valid')
            }
            attendeeData.firstName = firstName
        }catch({message}){
            validationError.addContext('firstName', message)
        }

        //last name
        try{    
            if(!this.model.validateLastName(lastName)){
                throw new Error('Last Name is not valid')
            }
            attendeeData.lastName = lastName
        }catch({message}){
            validationError.addContext('lastName', message)
        }

        // email
        try {
            if (!this.model.validateEmail(email)) {
                throw new Error('Email is not valid')
            }
            if((await this.model.count({
                where: {
                    email: attendeeData.email,
                    eventId: attendeeData.eventId
                }
            })) > 0) {
                throw new Error('Attendee already created')
            }
        } catch ({ message }) {
            validationError.addContext('email', message)
        }
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
        return res.send(connectionError);
    }
}

controller.putFunc = async function (req, res) {
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
			id: req.params.attendeeId,
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

module.exports = controller;