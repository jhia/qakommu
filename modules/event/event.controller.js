'use strict'

const Base = require('../../helpers/base.controller');
const getColors = require('get-image-colors');
const controller = new Base('event');
const { validateDate } = require('../../helpers/validations');
const { ResponseError } = require('../../http');
const Archive = require('../../helpers/archive');

const validAttributes = [
    'id', 'name', 'description', 'type', 'communityId', 'online',
    'noCfp', 'url', 'isPrivate', 'start', 'end', 'active',
    'promRate', 'image', 'primaryColor', 'secondaryColor'
];

controller.getFunc = async function (req, res) {

    const { limit, offset } = req.query;
    try {
        let events = await this.model.findAll({
            where: {
                isPrivate: false
            },
            attributes: validAttributes,
            limit,
            offset
        });

        await Promise.all(events.map((e, i) => Archive.route(e.image)
            .then((route) => { events[i].image = route })
            .catch(err => ({}))
        ));
        res.send(events);
    } catch({ message }) {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

controller.getEventsByCommunity = async function (req, res) {

    const { limit, offset } = req.query;
    try {
        let events = await this.model.findAll({
            where: {
                communityId: req.community.id
            },
            attributes: validAttributes,
            limit,
            offset
        });

        await Promise.all(events.map((e, i) => Archive.route(e.image)
            .then((route) => { events[i].image = route })
            .catch(err => ({}))
        ));
        res.send(events);
    } catch({ message }) {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

controller.getOne = async function(req, res) {
    const { eventId } = req.params;

    try {
        const event = await this.model.findByPk(eventId, {
            attributes: validAttributes
        });
        // no images
        try {
            event.image = await Archive.route(event.image)
        } catch {}

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
        communityId: req.community.id,
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
                let imgRoute = await Archive.from(image.id)
                let [primaryColor, secondaryColor] = await getColors(imgRoute, { count: 2 })
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

    const validationError = new ResponseError(400)

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
                let imgRoute = await Archive.from(image.id)
                let [primaryColor, secondaryColor] = await getColors(imgRoute, { count: 2 })
                eventData.primaryColor = primaryColor.hex()
                eventData.secondaryColor = secondaryColor.hex()
            }
            updatePicture = true;
        }

        if(updatePicture) {
            previousImageName = req.event.image;
        }

        const rows = await this.update({
			id: req.event.id,
			data: eventData
		});    

		if(rows > 0 && eventData.hasOwnProperty('image') && updatePicture) {
			await Archive.fromString(previousImageName).remove();
		}

		return res.send([])
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later');
        res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    try {

       if(req.event.image) {
            await Archive.fromString(req.event.image).remove();
       }
        
        let rows = await this.delete(req.event.id);
        return res.send(rows)
    } catch (error) {
        console.warn(error.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}


module.exports = controller;