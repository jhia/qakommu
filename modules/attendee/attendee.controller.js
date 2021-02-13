'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('attendee');
const { validateEmail } = require('../../helpers/utilities');
const { ResponseError } = require('../../http');


/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getFunc = async function (req, res) {

    const { limit, offset } = req.body;
    try {
        let attendees = await this.getData({
            limit,
            offset
        });

        res.statusCode = 200;
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
        const attendee = await this.model.findByPk(id);
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
        //idTicketSaleDetail  // required
    } = req.body;

    const validationError = new ResponseError(400);

    let attendeeData = {
        firstName,
        lastName,
        email,
        userId,
        isPresent,
        eventId : event,
    }

    try{    
        if(firstName){

        }

    }catch({message}){
        validationError.addContext('name', message)
    }

    try {
        if (id_event < 1 || id_state < 1 || id_ticket_sale_detail < 1 || name.length < 1 || email.length < 1) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent!',
            });
        }
        if (!validateEmail(email)) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, el formato del email no es valido',
            });
        }
        let newdate = await this.insert({
            id_user,
            name,
            email: email.toLowerCase(),
            is_present,
            id_ticket_sale_detail,
            rate,
            id_state,
            id_event
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: [newdate]
            });
        }
    } catch (error) {
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { id_user, name, email, is_present, id_ticket_sale_detail, rate, id_state, id_event, return_data } = req.body;

    try {
        if (id_event < 1 || id_state < 1 || id_ticket_sale_detail < 1 || name.length < 1 || email.length < 1) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent!',
            });
        }
        if (!validateEmail(email)) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, el formato del email no es valido',
            });
        }
        let result = await this.update(
            {
                id,
                data: {
                    id_user,
                    name,
                    email,
                    is_present,
                    id_ticket_sale_detail,
                    rate,
                    id_state,
                    id_event
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


//--------------------special functions--------------------

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

module.exports = controller;