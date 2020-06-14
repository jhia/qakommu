'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('event');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

/* ---------- basic functions ---------- */

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

    const { name, description, id_community, type, online, no_cfp, url_code, id_webside, is_private, start, end, active, id_call_for_paper, prom_rate, id_repository, id_state } = req.body;
    try {
        let newdate = await this.insert({
            name,
            description,
            id_community,
            type,
            online,
            no_cfp,
            url_code,
            id_webside,
            is_private,
            start,
            end,
            active,
            //id_call_for_paper, 
            prom_rate,
            id_repository,
            id_state
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
    const { name, description, id_community, type, online, no_cfp, url_code, id_webside, is_private, start, end, active, id_call_for_paper, prom_rate, id_repository, id_state, return_data } = req.body;
    try {
        let result = await this.update(
            {
                id,
                data:
                {
                    name,
                    description,
                    id_community,
                    type,
                    online,
                    no_cfp,
                    url_code,
                    id_webside,
                    is_private,
                    start,
                    end,
                    active,
                    //id_call_for_paper, 
                    prom_rate,
                    id_repository,
                    id_state
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


/* ---------- special functions ---------- */


controller.getSpeakersByEvent = async function (req, res) {
    const { id_event } = req.params;
    const { limit, offset, order } = req.body;

    try {
        const data = await this.db.speaker.findAll({
            limit,
            offset,
            attributes: ['id'],
            order,
            where: { id_event },
            include: [{
                attributes: ['name', 'last_name', 'profile_photo'],
                model: this.db.user,
                as: 'user'
            },
            {
                attributes: ['name', 'description'],
                model: this.db.session,
                as: 'session',
            },
            {
                attributes: ['name', 'blocker'],
                model: this.db.state,
                as: 'state',
                where: {
                    active: true
                }
            }

            ]
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

controller.getTicketsByEvent = async function (req, res) {
    const { id_event } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.ticket.findAll({
            limit,
            offset,
            attributes: ['id', 'name', 'description', 'base_price', 'quantity_total', 'quantity_current'],
            order,
            where: { id_event },
            include: [
                {
                    attributes: ['name', 'blocker'],
                    model: this.db.state,
                    as: 'state',
                    where: {
                        active: true
                    }
                },
                {
                    attributes: ['name'],
                    model: this.db.coupon,
                    as: 'coupon'
                }
            ]
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

controller.getAttendeesByEvent = async function (req, res) {
    const { id_event } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.attendee.findAll({
            limit,
            offset,
            attributes: ['id', 'name', 'dni', 'present', 'rate'],
            order,
            include: [
                {
                    attributes: ['name', 'blocker'],
                    model: this.db.state,
                    as: 'state',
                    where: {
                        active: true
                    }
                },
                {
                    attributes: ['code_ticket'],
                    model: this.db.ticket_sale_detail,
                    as: 'ticket_sale_detail'
                }
            ]
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