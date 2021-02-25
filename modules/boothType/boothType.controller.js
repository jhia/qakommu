'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('boothType');

const validAttributes = ['id', 'name', 'description', 'cost', 'width', 'height', 'active'];

controller.getTypesFromCommunity = async function (req, res) {
    const { limit, offset } = req.query;
    try {
        const types = await this.model.findAll({
            where: {
                communityId: req.community.id
            },
            limit,
            offset,
            attributes: validAttributes,
            order: [['id', 'DESC']]
        })

        return res.send(types);
    } catch (err) {
        console.log(err.message);
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

controller.getCountTypesFromCommunity = async function (req, res) {
    try {
        const count = await this.model.count({
            where: {
                communityId: req.community.id
            }
        })
        return res.send(count);
    } catch (err) {
        console.log(err.message);
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}


controller.getOne = async function (req, res) {
    try {
        const data = await this.model.findByPk(req.boothType.id, {
            attributes: validAttributes
        });
        return res.send(data);
    } catch (err) {
        console.log(err.message);
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError);
    }
}

controller.postFunc = async function (req, res) {

    const {
        name,
        description,
        cost,
        width,
        height,
        active
    } = req.body;

    const validationError = new ResponseError(400);

    const typeData = {
        name,
        description,
        width,
        height,
        active,
        cost,
        communityId: req.community.id
    }

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
    
    // cost
	try {
		if (!this.model.validateCost(cost)) {
			throw new Error('Cost is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('cost', message)
    }
    
    // width
    try {
        if (!this.model.validateWidth(width)) {
            throw new Error('Width is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('width', message)
    }

    // height
    try {
        if (!this.model.validateHeight(height)) {
            throw new Error('Height is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('height', message)
    }

    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    try {
        const newType = await this.insert(typeData, { returning: validAttributes })
        res.statusCode = 201
        return res.send(newType)
    } catch (err) {
        console.log(err.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.putFunc = async function (req, res) {

    let updateData = {};

    const validationError = new ResponseError(400);

    if(req.body.name) {
        // name
        try {
            if (!this.model.validateName(req.body.name)) {
                throw new Error('Name is not valid')
            }
            updateData.name = req.body.name;
        } catch ({ message }) {
            validationError.addContext('name', message)
        }
    }
    
    if(req.body.description) {
        // description
        try {
            if (!this.model.validateDescription(req.body.description)) {
                throw new Error('Description is not valid')
            }
            updateData.description = req.body.description;
        } catch ({ message }) {
            validationError.addContext('description', message)
        }
    }

    if(req.body.cost) {
        // cost
        try {
            if (!this.model.validateCost(req.body.cost)) {
                throw new Error('Cost is not valid')
            }
            updateData.cost = req.body.cost;
        } catch ({ message }) {
            validationError.addContext('cost', message)
        }
    }
    
    if(req.body.width) {
        // width
        try {
            if (!this.model.validateWidth(req.body.width)) {
                throw new Error('Width is not valid')
            }
            updateData.width = req.body.width;
        } catch ({ message }) {
            validationError.addContext('width', message)
        }
    }

    if(req.body.height) {
        // height
        try {
            if (!this.model.validateHeight(req.body.height)) {
                throw new Error('Height is not valid')
            }
            updateData.height = req.body.height;
        } catch ({ message }) {
            validationError.addContext('height', message)
        }
    }

    if(req.body.hasOwnProperty('active')) {
        updateData.active = !!req.body.active;
    }

    if(validationError.hasContext()) {
        return res.send(validationError);
    }

    try {
        let result = await this.update({
            id: req.boothType.id,
            data: updateData,
            returning: validAttributes
        });
        return res.send(result);
    } catch (error) {
        console.warn(error.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}


controller.deleteMultiple = async function (req, res) {
    const { id } = req.body;
    try {
        let deleterows = await this.model.destroy({ where: { id } })
        return res.send(deleterows)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

module.exports = controller;