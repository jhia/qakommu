'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('exhibitor');

const validAttributes = ['id','description','active'];
controller.getExhibitorByEvent = async function (req, res) {
    const { limit, offset } = req.query;

    try {
        const data = await this.model.findAll({
            where: {
                eventId: req.event.id
            },
            attributes: validAttributes,
            include: [
				{
					model: this.db.boothType,
					attributes: ['id', 'name', 'description', 'cost', 'width', 'height','active'],
					as: 'type'
				},
				{
					model: this.db.partnership,
					attributes: ['id', 'name', 'description', 'logo', 'web', 'active'],
					as: 'partnership'
				}
			],
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
  
    try {
        const event = await this.model.findByPk(req.exhibitor.id, {
            attributes: validAttributes,
            include: [
				{
					model: this.db.boothType,
					attributes: ['id', 'name', 'description', 'cost', 'width', 'height','active'],
					as: 'type'
				},
				{
					model: this.db.partnership,
					attributes: ['id', 'name', 'description', 'logo', 'web', 'active'],
					as: 'partnership'
				}
			],
        })
        return res.send(event)
    } catch {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.postFunc = async function (req, res) {

    const { description, partnership, boothType, active } = req.body;
    const exhibitorData = {
        description,
        partnershipId: partnership,
        boothTypeId: boothType,
        eventId: req.event.id,
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
    

    if(validationError.hasContext()) {
        return res.send(validationError)
    }
    
    try {
        let newExhibitor = await this.insert(exhibitorData, {returning: validAttributes});
        res.statusCode = 201;
        return res.send(newExhibitor)
    } catch (error) {
        console.warn(error.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.putFunc = async function (req, res) {

    const validationError = new ResponseError(400)
    const updateData = {};

    if(req.body.description) {
        // description
        try {
            if(!this.model.validateDescription(req.body.description)) {
                throw new Error('Description is not valid')
            }
            updateData.description = req.body.description
        } catch ({message}) {
            validationError.addContext('description', message)
        }
    }
   
    if(req.body.partnership) {
        // partnership
        try {
            if(!(await this.db.partnership.exists(req.body.partnership))) {
                throw new Error('Partnership does not exist')
            }
            updateData.partnershipId = req.body.partnership
        } catch ({message}) {
            validationError.addContext('partnership', message)
        }
    }

    if(req.body.boothType) {
        // booth type
        try {
            if(!(await this.db.boothType.exists(req.body.boothType))) {
                throw new Error('Booth type does not exist')
            }
            updateData.boothType = req.body.boothType
        } catch ({message}) {
            validationError.addContext('boothType', message)
        }
    }

    if (req.body.hasOwnProperty('active')) {
		updateData.active = Boolean(req.body.active)
	}


    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    try {
        const result = await this.update({
            id: req.exhibitor.id,
            data: updateData,
            returning: validAttributes
        });
        return res.send(result)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    try {
        let deleterows = await this.delete( req.exhibitor.id );
        return res.send(deleterows)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}



module.exports = controller;