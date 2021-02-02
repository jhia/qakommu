'use strict'

const Base = require('../../helpers/base.controller');
const getColors = require('get-image-colors');
const controller = new Base('event');
const { validateDate } = require('../../helpers/validations');
const { verify_and_upload_image_put, delete_image, upload_images } = require('../../helpers/utilities');
const { ResponseError } = require('../../http');
const Archive = require('../../helpers/archive');


controller.getFunc = async function (req, res) {

    const { limit, offset, order, attributes } = req.body;
    try {
        let events = await this.getData({
            id,
            limit,
            offset,
            attributes,
            order
        });

        for(let i = 0; i < events.length; i++) {
            if(!!events[i].image) {
                events[i].image = Archive.fromString(events[i].image).route;
            }
        }

        res.send(events);

        this.response({
            res,
            payload: id ? data : update_logo_path(data)
        });
    } catch {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }

}

controller.getOne = async function(req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const validationError = new ResponseError(400, 'Event id is not valid')
        return res.send(validationError);
    }

    try {
        const event = this.model.findByPk(id);
        if(!!event.image) {
            event.image = Archive.fromString(event.image).route;
        }
        return res.send(event);
    } catch {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
    
}


controller.postFunc = async function (req, res) {
    const {
        name, // required
        description, // required
        community,
        type, // required
        online, // required
        noCfp,
        url, // required
        isPrivate,
        start,
        end,
        active,
        promRate,
        primaryColor,
        secondaryColor
    } = req.body;

    const validationError = new ResponseError(400);

    let eventData = {
        name,
        description,
        type,
        online,
        url,
        noCfp,
        isPrivate,
        active,
        promRate,
        primaryColor,
        secondaryColor
    }

    try {
        if(!this.model.validateName(name)) {
            throw new Error('Name is not valid')
        }
    } catch ({message}) {
        validationError.addContext('name', message)
    }

    try {
        if(!this.model.validateDescription(description)) {
            throw new Error('Description is not valid')
        }
    } catch ({message}) {
        validationError.addContext('description', message)
    }

    try {
        if(!this.model.validateType(type)) {
            throw new Error('Not a valid type')
        }
        if(type === 'w' && !online) {
            throw new Error('Webinars cannot be in person')
        }
    } catch ({message}) {
        validationError.addContext('type', message)
    }

    try {
        if(!this.model.validateUrl(url)) {
            throw new Error('Not a valid url')
        }
        if(type === 'w' && !online) {
            throw new Error('Webinars cannot be in person')
        }
    } catch ({message}) {
        validationError.addContext('url', message)
    }

    if(start) {
        try {
            console.log(start, validateDate(start))
            if(!validateDate(start)) {
                throw new Error('Start date must follow the yyyy-mm-dd format')
            }
            eventData.start = start;
        } catch ({message}) {
            validationError.addContext('start', message)
        }
    }

    if(end) {
        try {
            if(!validateDate(end)) {
                throw new Error('End date must follow the yyyy-mm-dd format')
            }
            eventData.end = end;
        } catch ({message}) {
            validationError.addContext('end', message)
        }
    }

    if(community) {
        try {
            if(!(await this.db.community.exists(community))) {
                throw new Error('This community does not exists')
            }
            event.communityId = community;
        } catch ({message}) {
            validationError.addContext('community', message)
        }
    }

    if(validationError.hasContext()) {
		return res.send(validationError)
	}

    try {
        if(req.files && req.files.image) {
            let image = new Archive('event', req.files.image);
            await image.upload()
            eventData.image = image.route;
            if(!primaryColor || !secondaryColor) {
                let [primaryColor, secondaryColor] = await getColors(path.join(__dirname, '.' + image.route), { count: 2 })
                eventData.primaryColor = primaryColor.hex()
                eventData.secondaryColor = secondaryColor.hex()
            }
        }
        
        let result = await this.insert(eventData);

        res.statusCode = 201;
        res.send(result);

    } catch({ message }) {
        console.log(message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, description, id_community, type, online, no_cfp, url_code, id_webside, is_private, start, end, active, id_call_for_paper, prom_rate, id_repository, id_state, return_data } = req.body;
    try {

        if(type==='w' && !online ){
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, webinars cannot be in person'
            });
        }

        if((type==='w' && no_cfp) || (type==='m' && no_cfp)){
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, this type of event requires us to use call for papers'
            });
        }

        let find_image = await this.db.event.findOne({
            where: { id }
        });
        const fnd_image = find_image.image ? find_image.image : null;
        const avatar = req.files ? req.files.image : undefined;
        let image = avatar && verify_and_upload_image_put(avatar, "event", fnd_image);
        if (req.body.image == 'not-image') image = null;
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
            if (fnd_image && image) delete_image(fnd_image);
            if (req.body.image == 'not-image' && fnd_image) delete_image(fnd_image);
            if (image) upload_images(avatar, archive[0], archive[1].split(".")[0]);
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
controller.getEventsByCommunity = async function (req, res) {
    const { id_community } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.event.findAll({
            limit,
            offset,
            attributes: ['id', 'name', 'description', 'type', 'online', 'no_cfp', 'url_code', 'id_webside', 'is_private', 'start', 'end', 'active', 'prom_rate', 'id_repository', 'image', 'host'],
            order,
            where: { id_community },
            include: [
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


controller.getPublicEventsByCommunity = async function (req, res) {
    const { id_community } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.event.findAll({
            limit,
            offset,
            attributes: ['id', 'name', 'description', 'type', 'online', 'no_cfp', 'url_code', 'id_webside', 'is_private', 'start', 'end', 'active', 'prom_rate', 'id_repository', 'image', 'host'],
            order,
            where: { id_community, is_private: false },
            include: [
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
        console.log(error);
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });
    }
}


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
                attributes: ['name', 'last_name', 'profile_photo','username', 'organization', 'email', 'country_code', 'phone', 'country', 'city', 'address','zip_code'],
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
            attributes: ['id', 'id_user', 'name','email', 'is_present', 'rate'],
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