'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('session');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getSessionsForEvent = async function (req, res) {
    const { limit, offset } = req.query;

    try {
        const sessions = await this.model.findAll({
            where: {
                eventId: req.event.id
            },
            limit,
            offset
        })

        return res.send(sessions)
    } catch {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.getOne = async function (req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
        let idError = new ResponseError(400, 'Session id is not valid')
        return res.send(idError)
    }

    try {
        const data = await this.findByPk(id);
        return res.send(data);
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }

}

controller.getTracksBySession = async function (req, res) {
    const { id } = req.params;
    const { limit, offset } = req.query;

    if (isNaN(id)) {
        let idError = new ResponseError(400, 'Session id is not valid')
        return res.send(idError)
    }
    try {
        const data = await this.db.sessionTrack.findAll({
            where: {
                sessionId: id
            },
            limit,
            offset,
            attributes: ['id'],
            include: [
                {
                    attributes: ['name', 'description', 'color'],
                    model: this.db.track,
                    as: 'track',
                    /*where: {
                        active: true
                    }*/
                }
            ]
        });
        return res.send(data.map(d => d.track))
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}


controller.postFunc = async function (req, res) {

    const {
        name,
        description,
        order,
        start,
        end,
        hasBreak,
        questionTime,
        room,
        event
    } = req.body;

    const data = {
        name,
        description,
        order: order || 1,
        start,
        end,
        hasBreak: Boolean(hasBreak),
        questionTime,
        roomId: room,
        eventId: event
    }

    const validationError = new ResponseError(400)

    // name
    try {
        if (!this.model.validateName(name)) {
            throw new Error('Name is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('name', message)
    }

    // description
    try {
        if (!this.model.validateDescription(description)) {
            throw new Error('Description is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('description', message)
    }

    // order
    try {
        if (!this.model.validateOrder(order)) {
            throw new Error('Order must be a positive integer starting from 1')
        }
    } catch ({ message }) {
        validationError.addContext('order', message)
    }

    // start
    try {
        if (!this.model.validateStartDate(start)) {
            throw new Error('Start date must be in yyyy-mm-dd format')
        }
    } catch ({ message }) {
        validationError.addContext('start', message)
    }

    // end
    try {
        if (!this.model.validateEndDate(end)) {
            throw new Error('End date must be in yyyy-mm-dd format')
        }
    } catch ({ message }) {
        validationError.addContext('end', message)
    }

    // question time
    try {
        // TODO: validate if question time is greater than time between start and end
        if (!this.model.validateQuestionTime(questionTime)) {
            throw new Error('Question time is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('questionTime', message)
    }

    // room
    try {
        if (!(await this.db.room.exists(room))) {
            throw new Error('Room does not exist')
        }
    } catch ({ message }) {
        validationError.addContext('room', message)
    }

    // event
    try {
        if (!(await this.db.event.exists(event))) {
            throw new Error('Event does not exist')
        }
    } catch ({ message }) {
        validationError.addContext('event', message)
    }


    try {
        let newdate = await this.insert(data);
        res.statusCode = 201;
        return res.send(newdate)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
        let idError = new ResponseError(400, 'Room id is not valid')
        return res.send(idError)
    }

    const data = {};

    const validationError = new ResponseError(400)

    // name
    if (req.body.name) {
        try {
            if (!this.model.validateName(req.body.name)) {
                throw new Error('Name is not valid')
            }
            data.name = req.body.name
        } catch ({ message }) {
            validationError.addContext('name', message)
        }
    }

    if (req.body.description) {

        // description
        try {
            if (!this.model.validateDescription(req.body.description)) {
                throw new Error('Description is not valid')
            }
            data.description = req.body.description
        } catch ({ message }) {
            validationError.addContext('description', message)
        }
    }

    // order
    if (req.body.order) {
        try {
            if (!this.model.validateOrder(req.body.order)) {
                throw new Error('Order must be a positive integer starting from 1')
            }
            data.order = req.body.order
        } catch ({ message }) {
            validationError.addContext('order', message)
        }
    }

    // start
    if (req.body.start) {
        try {
            if (!this.model.validateStartDate(req.body.start)) {
                throw new Error('Start date must be in yyyy-mm-dd format')
            }
            data.start = req.body.start
        } catch ({ message }) {
            validationError.addContext('start', message)
        }
    }

    if (req.body.end) {
        // end
        try {
            if (!this.model.validateEndDate(req.body.end)) {
                throw new Error('End date must be in yyyy-mm-dd format')
            }
            data.end = req.body.end
        } catch ({ message }) {
            validationError.addContext('end', message)
        }
    }

    // question time
    if (req.body.questionTime) {
        try {
            // TODO: validate if question time is greater than time between start and end
            if (!this.model.validateQuestionTime(questionTime)) {
                throw new Error('Question time is not valid')
            }
            data.questionTime = req.body.questionTime
        } catch ({ message }) {
            validationError.addContext('questionTime', message)
        }
    }

    if (req.body.room) {
        // room
        try {
            if (!(await this.db.room.exists(req.body.room))) {
                throw new Error('Room does not exist')
            }
            data.roomId = req.body.room
        } catch ({ message }) {
            validationError.addContext('room', message)
        }
    }

    try {
        let result = await this.update({
            id,
            data
        });
        return res.send(result)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
        let idError = new ResponseError(400, 'Room id is not valid')
        return res.send(idError)
    }

    try {
        let deleterows = await this.delete({ id });
        return res.send(deleterows)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}



module.exports = controller;