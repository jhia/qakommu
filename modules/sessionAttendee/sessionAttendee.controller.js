'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');
const Archive = require('../../helpers/archive');

const controller = new Base('sessionAttendee');

const validAttributes = ['id', 'sessionId', 'attendeeId', 'isPresent', 'rate', 'comment']

controller.getAllBySession = async function (req, res) {
    const { sessionId } = req.params;
    const { limit, offset } = req.query;
    try {
        const data = await this.model.findAll({
            where: {
                sessionId,
            },
            attributes: validAttributes,
            limit,
            offset
        })
        return res.send(data)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.getAllByAttendee = async function (req, res) {
    const { attendeeId } = req.params;
    const { limit, offset } = req.query;
    try {
        const data = await this.model.findAll({
            where: {
                attendeeId,
            },
            attributes: validAttributes,
            limit,
            offset
        })
        return res.send(data)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.getOneSessionAttendee = async function (req, res) {
    try {
        const data = await this.model.findByPk(req.sessionAttendee.id, {
            attributes: validAttributes,
            include: [
                {
                    model: this.db.session,
                    attributes: ['id', 'name', 'description'],
                    as: 'session'
                },
                {
                    model: this.db.attendee,
                    attributes: ['id', 'firstName', 'lastName'],
                    include: [{
                        model: this.db.user,
                        attributes: ['firstName', 'lastName', 'username', 'profilePhoto'],
                        as: 'user'
                    }],
                    as: 'attendee'
                }
            ]
        })

        if(data.attendee.hasOwnProperty('user') && data.attendee.user.profilePhoto) {
            data.attendee.user.profilePhoto = await Archive.route(data.attendee.user.profilePhoto)
        }
        return res.send(data)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.postFunc = async function (req, res) {
    const {
        attendee, // needed
        isPresent,
        rate,
        comment
    } = req.body;

    const validationError = new ResponseError(400)
    
    const data = {
        sessionId: req.session.id,
        attendeeId: attendee,
        isPresent
    }

    try {
        if(!(await this.db.attendee.exists(attendee))) {
            throw new Error('Attendee does not exist')
        }

        if((await this.model.count({ where: { sessionId: req.session.id, attendeeId: attendee } })) > 0) {
            throw new Error('Attendee already registered into session')
        }
    } catch ({ message }) {
        validationError.addContext('attendee', message)
    }

    if(isPresent && rate) {
        try {
            if(!await this.model.validateRate(rate)) {
                throw new Error('Rate is not valid')
            }
            data.rate = rate;
        } catch ({ message }) {
            validationError.addContext('rate', message)
        }
    }

    if(isPresent && comment) {
        try {
            if(!await this.model.validateComment(comment)) {
                throw new Error('Comment is not valid')
            }
            data.comment = comment;
        } catch ({ message }) {
            validationError.addContext('comment', message)
        }
    }

    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    try {
        let result = await this.insert(data);
        res.statusCode = 201;
        return res.send(result);
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.putFunc = async function (req, res) {
    const data = {};
    const validationError = new ResponseError(400)

    if(req.body.hasOwnProperty('isPresent')) {
        data.isPresent = !!req.body.isPresent;
    }

    // attendee is present or was previously
    // changed as present, it can comment.
    if(data.isPresent ||
        (!(req.body.hasOwnProperty('isPresent')) && req.sessionAttendee.isPresent)) {
        if(req.body.rate) {
            try {
                if(!await this.model.validateRate(req.body.rate)) {
                    throw new Error('Rate is not valid')
                }
                data.rate = req.body.rate;
            } catch ({ message }) {
                validationError.addContext('rate', message)
            }
        }

        if(req.body.comment) {
            try {
                if(!await this.model.validateComment(req.body.comment)) {
                    throw new Error('Comment is not valid')
                }
                data.comment = req.body.comment;
            } catch ({ message }) {
                validationError.addContext('comment', message)
            }
        }
    }

    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    try {
        let result = await this.update({
            id: req.sessionAttendee.id,
            data
        });

        return res.send(result);
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    const { sessionAttendeeId } = req.params;
    try {
        let deleterows = await this.delete(sessionAttendeeId);
        return res.send(deleterows);
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}


module.exports = controller;