'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('type_booth');


controller.getTypesFromCommunity = async function (req, res) {
    const { limit, offset } = req.query;
    try {
        const types = await this.model.findAll({
            where: {
                communityId: req.community.id
            },
            limit,
            offset,
            attributes: ['id', 'name', 'description', 'cost', 'sizeWidth', 'sizeHeight', 'active'],
            order: [['id', 'DESC']]
        })

        return res.send(types);
    } catch (err) {
        console.log(err.message)
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}

controller.getCountTypesFromCommunity = async function (req, res) {
    const { limit, offset } = req.query;
    try {
        const count = await this.model.count({
            where: {
                communityId: req.community.id
            },
            limit,
            offset
        })
        return res.send({ count });
    } catch (err) {
        console.log(err.message);
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}


controller.getOne = async function (req, res) {

    const { id } = req.params;

    if(isNaN(id)) {
        const validationError = new ResponseError(400, 'Booth type id is not valid');
        return res.send(validationError);
    }

    try {
        const data = await this.model.findByPk(id, {
            attributes: ['id', 'name', 'description', 'cost', 'sizeWidth', 'sizeHeight', 'active']
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
        active,
        community
    } = req.body;

    const validationError = new ResponseError(400);

    const typeData = {
        name,
        description,
        width,
        height,
        active,
        communityId: community
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
		if (!this.model.validateCost(name)) {
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

    // community
    try {
        if (!(await this.db.community.exists(community))) {
            throw new Error('This community does not exist')
        }
    } catch ({ message }) {
        validationError.addContext('community', message)
    }

    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    try {
        const newType = await this.insert(typeData)
        res.statusCode = 201
        return res.send(newType)
    } catch (err) {
        console.log(err.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(newType)
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const idError = new ResponseError(400, 'Booth type id is not valid');
        return res.send(idError)
    }

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
            if (!this.model.validateCost(name)) {
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

    if(validationError.hasContext()) {
        return res.send(validationError);
    }

    try {
        let result = await this.update({
            id,
            data: updateData
        });
        return res.send(result);
    } catch (error) {
        console.warn(error.message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const idError = new ResponseError(400, 'Booth type id is not valid');
        return res.send(idError)
    }

    try {
        let rows = await this.delete({ id });
        return res.send(rows);
    } catch (error) {
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