'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('exhibitor');


controller.getExhibitorByEvent = async function (req, res) {
    const { limit, offset } = req.query;

    try {
        const data = await this.model.findAll({
            where: {
                eventId: req.event.id
            },
            limit,
            offset
        });
        return res.send(data);
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }

}

controller.getOne = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const validationError = new ResponseError(400, 'Exhibitor id is not valid')
        return res.send(validationError)
    }

    try {
        const event = this.model.findByPk(id, {
            include: [this.model.associations.boothType, this.model.associations.partnership],
        })
        return res.send(event)
    } catch {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.postFunc = async function (req, res) {

    const { description, partnership, boothType, event, active } = req.body;
    const exhibitorData = {
        description,
        partnershipId: partnership,
        boothTypeId: boothType,
        eventId: event,
        active
    };

    const validationError = new ResponseError(400)

    // description
	try {
		if(!this.model.validateDescription(description)) {
			throw new Error('Description is not valid')
		}
	} catch ({message}) {
		validationError.addContext('description', message)
    }
    
    // partnership
	try {
		if(!(await this.db.partnership.exists(partnership))) {
			throw new Error('Partnership does not exist')
		}
	} catch ({message}) {
		validationError.addContext('partnership', message)
    }

    // booth type
    try {
		if(!(await this.db.boothType.exists(boothType))) {
			throw new Error('Booth type does not exist')
		}
	} catch ({message}) {
		validationError.addContext('boothType', message)
    }
    
    // event
    try {
		if(!(await this.db.event.exists(event))) {
			throw new Error('Event does not exist')
		}
	} catch ({message}) {
		validationError.addContext('event', message)
    }

    if(validationError.hasContext()) {
        return res.send(validationError)
    }
    
    try {
        let newExhibitor = await this.insert(exhibitorData);
        res.statusCode = 201;
        return res.send(newExhibitor)
    } catch (error) {
        console.warn(error.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const idError = new ResponseError(400, 'Exhibitor id is not valid')
        return res.send(idError)
    }

    const validationError = new ResponseError(400)
    const updateData = {};

    if(res.body.description) {
        // description
        try {
            if(!this.model.validateDescription(res.body.description)) {
                throw new Error('Description is not valid')
            }
            updateData.description = res.body.description
        } catch ({message}) {
            validationError.addContext('description', message)
        }
    }
    
    if(res.body.partnership) {
        // partnership
        try {
            if(!(await this.db.partnership.exists(res.body.partnership))) {
                throw new Error('Partnership does not exist')
            }
            updateData.partnershipId = res.body.partnership
        } catch ({message}) {
            validationError.addContext('partnership', message)
        }
    }

    if(res.body.boothType) {
        // booth type
        try {
            if(!(await this.db.boothType.exists(res.body.boothType))) {
                throw new Error('Booth type does not exist')
            }
            updateData.boothType = res.body.boothType
        } catch ({message}) {
            validationError.addContext('boothType', message)
        }
    }

    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    try {
        let result = await this.update({
            id,
            data: updateData
        });
        return res.send(result)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const idError = new ResponseError(400, 'Exhibitor id is not valid')
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