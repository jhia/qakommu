'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('event');
const { verify_and_upload_image_post, verify_and_upload_image_put, delete_image, upload_images } = require('../../helpers/utilities')

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

        const update_logo_path = x => x.map(x => {
            x.logo = x.logo && '/uploads/' + x.logo;
            return x;
        })
        data.logo = data.logo && '/uploads/' + data.logo;

        this.response({
            res,
            payload: id ? data : update_logo_path(data)
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
        let image = null;
        const host = req.headers.host
        const avatar = req.files ? req.files.image : null;
        image = verify_and_upload_image_post(avatar, "event");
        const archive = image ? image.split("_") : null;
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
            id_state,
            image,
            host
        });
        if (newdate) {
            if(image) upload_images(avatar,archive[0],archive[1].split(".")[0]);
            return this.response({
                res,
                statusCode: 201,
                payload: [newdate]
            });
        }
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

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, description, id_community, type, online, no_cfp, url_code, id_webside, is_private, start, end, active, id_call_for_paper, prom_rate, id_repository, id_state, return_data } = req.body;
    try {
        let find_image = await this.db.event.findOne({
            where: { id }
        });
        const fnd_image = find_image.image ? find_image.image : null;
        const avatar = req.files ? req.files.image : undefined;
        let image = avatar && verify_and_upload_image_put(avatar, "event", fnd_image);
        if(req.body.image == 'not-image') image = null;
        const archive = image ? image.split("_") : null;

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
                    id_state,
                    image
                },
                return_data
            });
        if (result) {
            if(fnd_image && image) delete_image(fnd_image);
            if(req.body.image == 'not-image' && fnd_image) delete_image(fnd_image);
            if(image) upload_images(avatar,archive[0],archive[1].split(".")[0]);
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
        let find_image = await this.db.event.findOne({
            where: { id }
        });
        if (find_image.image) delete_image(find_image.image);
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
            attributes: ['id', 'id_user', 'name', 'dni', 'is_present', 'rate'],
            order,
            where: {
                id_event
            },
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
                    attributes: ['name', 'last_name', 'username', 'profile_photo', 'address', 'email', 'phone'],
                    model: this.db.user,
                    as: 'user'
                },
                {
                    attributes: ['uuid', 'deactivated'],
                    model: this.db.ticket_sale_detail,
                    as: 'ticket_sale_detail',
                    include: [
                        {
                            attributes: ['name_ticket'],
                            model: this.db.ticket_sale,
                            as: 'ticket_sale',
                        }
                    ]
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