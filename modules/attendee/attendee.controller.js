'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const { validateEmail } = require('../../helpers/utilities');

const controller = new Base('attendee');

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

controller.postFunc = async function (req, res) {

    const { id_user, name, dni,email, is_present, id_ticket_sale_detail, rate, id_state, id_event } = req.body;
    
    try {
        if (id_event < 1 || id_state < 1 ||  id_ticket_sale_detail < 1 || name.length < 1 || dni.length < 1 || email < 1 ) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent!',
            });
        }
        if(!validateEmail(email)){
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
            dni,
            email : email.toLowerCase(),
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
    const { id_user, name, dni, email, is_present, id_ticket_sale_detail, rate, id_state, id_event, return_data } = req.body;

    try {
        if (id_event < 1 || id_state < 1 ||  id_ticket_sale_detail < 1 || name.length < 1 || dni.length < 1 || email < 1 ) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent!',
            });
        }
        if(!validateEmail(email)){
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
                    dni,
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


//--------------------sepcial functions--------------------

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
        console.log(error);
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });

    }

}


module.exports = controller;