'use strict'

const Base = require('../../helpers/base.controller');
const getColors = require('get-image-colors');
const controller = new Base('event');
const { validateDate } = require('../../helpers/validations');
const { ResponseError } = require('../../http');
const Archive = require('../../helpers/archive');


controller.getFunc = async function (req, res) {

    const { limit, offset } = req.body;
    try {
        let events = await this.getData({
            limit,
            offset
        });

        res.send(events);

    } catch({ message }) {
        console.log(message)
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
        const event = await this.model.findByPk(id, {
            include: [this.model.associations.community]
        });
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
        communityId: community,
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
        if(req.body.hasOwnProperty('online')) {
            if(type === 'w' && !online) {
                throw new Error('Webinars cannot be in person')
            }
        } else {
            eventData.online = type !== 'c'; // by default conferences are not online
        }
    } catch ({message}) {
        validationError.addContext('type', message)
    }

    try {
        if(!this.model.validateUrl(url)) {
            throw new Error('Not a valid url')
        }
    } catch ({message}) {
        validationError.addContext('url', message)
    }

    try {
        if(!(await this.db.community.exists(community))) {
            throw new Error('This community does not exists')
        }
    } catch ({message}) {
        validationError.addContext('community', message)
    }

    if(start) {
        try {
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

    if(validationError.hasContext()) {
		return res.send(validationError)
	}

    try {
        if(req.files && req.files.image) { // there's image
            let image = new Archive('event', req.files.image); // let the handler do it
            await image.upload(); // save image
            eventData.image = image.id;
            if(!primaryColor || !secondaryColor) { // get main colors if not set
                let [primaryColor, secondaryColor] = await getColors(image.route, { count: 2 })
                eventData.primaryColor = primaryColor.hex()
                eventData.secondaryColor = secondaryColor.hex()
            }
        }
        
        let result = await this.insert(eventData);

        res.statusCode = 201;
        res.send(result);

    } catch(err) {
        console.error(err)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const idError = new ResponseError(400, 'Event id is not valid')
        return res.send(idError);
    }

    const validationError = new ResponseError(400, 'Event id is not valid')

    let eventData = {};

    if(req.body.name) {
        try {
            if(!this.model.validateName(req.body.name)) {
                throw new Error('Name is not valid')
            }
            eventData.name = req.body.name
        } catch ({message}) {
            validationError.addContext('name', message)
        }
    }

    if(req.body.description) {
        try {
            if(!this.model.validateDescription(req.body.description)) {
                throw new Error('Description is not valid')
            }
            eventData.description = req.body.description
        } catch ({message}) {
            validationError.addContext('description', message)
        }
    }

    if(req.body.type) {
        try {
            if(!this.model.validateType(req.body.type)) {
                throw new Error('Not a valid type')
            }
            eventData.type = req.body.type;
            if(req.body.hasOwnProperty('online')) {
                if(req.body.type === 'w' && !req.body.online) {
                    throw new Error('Webinars cannot be in person')
                }
                eventData.online = !!req.body.online;
            } else {
                eventData.online = req.body.type !== 'c'; // by default conferences are not online
            }
        } catch ({message}) {
            validationError.addContext('type', message)
        }
    }

    if(req.body.url) {
        try {
            if(!this.model.validateUrl(url)) {
                throw new Error('Not a valid url')
            }
        } catch ({message}) {
            validationError.addContext('url', message)
        }
    }

    if(req.body.community) {
        try {
            let community = await this.db.community.findByPk(req.body.community)
            if(!community) {
                throw new Error('This community does not exist')
            }

            if(!(await community.canCreateEvents(req.user.id))) {
                throw new Error('You don\'t have the right permissions for this community')
            }
            eventData.communityId = community.id
        } catch ({message}) {
            validationError.addContext('community', message)
        }
    }

    if(req.body.start) {
        try {
            if(!validateDate(req.body.start)) {
                throw new Error('Start date must follow the yyyy-mm-dd format')
            }
            eventData.start = req.body.start;
        } catch ({message}) {
            validationError.addContext('start', message)
        }
    }

    if(req.body.end) {
        try {
            if(!validateDate(req.body.end)) {
                throw new Error('End date must follow the yyyy-mm-dd format')
            }
            eventData.end = req.body.end;
        } catch ({message}) {
            validationError.addContext('end', message)
        }
    }

    if(req.body.promRate) {
        eventData.promRate = req.body.promRate;
    }

    // booleans
    if(req.body.hasOwnProperty('noCfp')){
        eventData.noCfp = !!req.body.noCfp;
    }

    if(req.body.hasOwnProperty('isPrivate')) {
        eventData.isPrivate = !!req.body.isPrivate;
    }

    if(req.body.hasOwnProperty('active')) {
        eventData.active = !!req.body.active;
    }

    if(validationError.hasContext()) {
		return res.send(validationError)
    }

    try {
        let updatePicture = false;
        let previousImageName = null;
        if(req.files && req.files.image) { // there's image
            let image = new Archive('event', req.files.image); // let the handler do it
            await image.upload() // save image
            eventData.image = image.id;
            if(!primaryColor || !secondaryColor) { // get main colors if not sent
                let [primaryColor, secondaryColor] = await getColors(image.route, { count: 2 })
                eventData.primaryColor = primaryColor.hex()
                eventData.secondaryColor = secondaryColor.hex()
            }
            updatePicture = true;
        }

        if(updatePicture) {
            let r = await this.findByPk(req.params.id, { attributes: ['image'] })
            previousImageName = r.image;
        }

        const rows = await this.model.update({
			id: req.params.id,
			data: eventData
		});

		if(rows > 0 && eventData.hasOwnProperty('image') && updatePicture) {
			await Archive.fromString(previousImageName).remove();
		}

		return res.send([])
    } catch (error) {
        console.log(error.message);
        const connectionError = new ResponseError(503, 'Try again later');
        res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const validationError = new ResponseError(400, 'Event id is not valid')
        return res.send(validationError);
    }

    try {
        let event = await this.model.findByPk(id, { attributes: [ 'id', 'image' ]});
        if(!event) {
            const notFoundError = new ResponseError(404, 'This event does not exist')
            return res.send(notFoundError);
        }

        await Archive.fromString(event.image).remove();
        
        let rows = await this.delete({ id });
        return res.send(rows)
    } catch (error) {
        console.warn(error.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

/*

// ---------- special functions ----------
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
}*/

module.exports = controller;