'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('sponsorType');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getTypesByCommunity = async function (req, res) {
    try {
        const data = await this.model.findAll({
            where: {
                communityId: req.community.id
            }
        })
        return res.send(data)
    } catch {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.getCountTypesByCommunity = async function (req, res) {
    try {
        const count = await this.model.count({
            where: {
                communityId: req.community.id
            }
        })
        return res.send({ count })
    } catch {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.getOne = async function (req, res) {

    const { id } = req.params;

    if (isNaN(id)) {
        let idError = new ResponseError(400, 'Sponsor id is not valid')
        return res.send(idError)
    }

    try {
        const data = await this.model.findByPk(id)
        return res.send(data)
    } catch {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.postFunc = async function (req, res) {
    const {
        name,
        description,
        contributionValue,
        displayNumber,
        active,
        community
    } = req.body;

    const data = {
        name,
        description,
        contributionValue,
        displayNumber,
        active,
        communityId: community
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

    // contribution value
    try {
        if (!this.model.validateContributionValue(contributionValue)) {
            throw new Error('Contribution value is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('contributionValue', message)
    }

    // display number
    try {
        if (!this.model.validateDisplayNumber(displayNumber)) {
            throw new Error('Display number is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('displayNumber', message)
    }

    try {
        if (!(await this.db.community.exists(community))) {
            throw new Error('Community does not exists')
        }
    } catch ({ message }) {
        validationError.addContext('community', message)
    }

    if (validationError.hasContext()) {
        return res.send(validationError)
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
        let idError = new ResponseError(400, 'Sponsor id is not valid')
        return res.send(idError)
    }

    let data = {};

    const validationError = new ResponseError(400)

    // name
    if(req.body.name) {
        try {
            if (!this.model.validateName(req.body.name)) {
                throw new Error('Name is not valid')
            }
            data.name = req.body.name
        } catch ({ message }) {
            validationError.addContext('name', message)
        }
    }

    // description
    if (req.body.description) {
        try {
            if (!this.model.validateDescription(req.body.description)) {
                throw new Error('Description is not valid')
            }
            data.description = req.body.description
        } catch ({ message }) {
            validationError.addContext('description', message)
        }
    }


    if(req.body.contributionValue) {
        // contribution value
        try {
            if (!this.model.validateContributionValue(req.body.contributionValue)) {
                throw new Error('Contribution value is not valid')
            }
            data.contributionValue = req.body.contributionValue
        } catch ({ message }) {
            validationError.addContext('contributionValue', message)
        }
    }

    // display number
    if(req.body.displayNumber) {
        try {
            if (!this.model.validateDisplayNumber(req.body.displayNumber)) {
                throw new Error('Display number is not valid')
            }
            data.displayNumber = req.body.displayNumber
        } catch ({ message }) {
            validationError.addContext('displayNumber', message)
        }
    }

    if(req.body.hasOwnProperty('active')) {
        data.active = Boolean(req.body.active)
    }

    if (validationError.hasContext()) {
        return res.send(validationError)
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
        let idError = new ResponseError(400, 'Sponsor id is not valid')
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

controller.deleteMultiple = async function (req, res) {

    const { id } = req.body;

    try {
        let deleterows = await this.model.destroy({
            where: {
                id: id
            }
        });
        return res.send(deleterows)
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}


module.exports = controller;