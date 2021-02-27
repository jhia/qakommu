'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('partnership');
const { ResponseError } = require('../../http');
const Archive = require('../../helpers/archive');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/


controller.getFunc = async function (req, res) {
    const { limit, offset } = req.query;
    try {
        const data = await this.getData({
            limit,
            offset,
        });

        return res.send(data);
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }

}

controller.getOne = async function (req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
        const idError = new ResponseError(400, 'Partnership id is not valid')
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

controller.getPartnershipByCommunity = async function (req, res) {

    try {
        const data = this.db.communityPartnership.findAll({
            where: {
                communityId: req.community.id
            },
            attributes: ['partnershipId'],
            include: [{
                model: this.db.partnership,
                as: 'partnership'
            }]
        })

        return res.send(data.map(d => d.partnership))
    } catch {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.postFunc = async function (req, res) {
    const {
        name, // required
        description,
        web,
        active
    } = req.body;

    const data = {
        name,
        active
    };

    const validationError = new ResponseError(400)

    try {
        if(!this.model.validateName(name)) {
            throw new Error('Name is not valid')
        }
    } catch ({ message }) {
        validationError.addContext('name', message)
    }

    if(description) {
        try {
            if(!this.model.validateDescription(description)) {
                throw new Error('Description is not valid')
            }
            data.description = description
        } catch ({ message }) {
            validationError.addContext('description', message)
        }
    }

    if(web) {
        try {
            if(!this.model.validateWeb(web)) {
                throw new Error('Web is not valid')
            }
            data.web = web 
        } catch ({ message }) {
            validationError.addContext('web', message)
        }
    }

    if (validationError.hasContext()) {
		return res.send(validationError)
    }
    
    try {
        if(req.files && req.files.logo) { // there's image
            let logo = new Archive('partnership', req.files.logo); // let the handler do it
            await logo.upload() // save image
            data.logo = logo.id;
        }
        
        let result = await this.insert(data);

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
        const idError = new ResponseError(400, 'Partnership id is not valid');
        return res.send(idError);
    }

    const data = {};

    const validationError = new ResponseError(400)

    if(req.body.name) {
        try {
            if(!this.model.validateName(req.body.name)) {
                throw new Error('Name is not valid')
            }
            data.name= req.body.name
        } catch ({ message }) {
            validationError.addContext('name', message)
        }
    }

    if(req.body.description) {
        try {
            if(!this.model.validateDescription(req.body.description)) {
                throw new Error('Description is not valid')
            }
            data.description = req.body.description
        } catch ({ message }) {
            validationError.addContext('description', message)
        }
    }

    if(req.body.web) {
        try {
            if(!this.model.validateWeb(req.body.web)) {
                throw new Error('Web is not valid')
            }
            data.web = req.body.web
        } catch ({ message }) {
            validationError.addContext('web', message)
        }
    }

    if(req.body.hasOwnProperty('active')) {
        data.active = Boolean(req.body.active)
    }

    if (validationError.hasContext()) {
		return res.send(validationError)
    }

    try {
        let updatePicture = false;
        let previousImageName = null;
        if(req.files && req.files.logo) { // there's image
            let image = new Archive('partnership', req.files.logo); // let the handler do it
            await image.upload() // save image
            data.logo = image.id;
            updatePicture = true;
        }

        if(updatePicture) {
            let r = await this.model.findByPk(id, { attributes: ['logo'] })
            previousImageName = r.logo;
        }

        const rows = await this.update({
			id,
			data
		});

		if(rows > 0 && data.hasOwnProperty('logo') && updatePicture && previousImageName) {
			await (await Archive.fromString(previousImageName)).remove();
		}

		return res.send([])
    } catch (err) {
        console.log(err)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}


controller.deleteFunc = async function (req, res) {
    const { id } = req.params;

    if(isNaN(id)) {
        const idError = new ResponseError(400, 'Partnership id is not valid');
        return res.send(idError);
    }

    try {
        let prev = await this.model.findByPk(id, {
            attributes: ['logo']
        })

        if(!prev) {
            const notFoundError = new ResponseError(404, 'Partnership not found');
            return res.send(notFoundError)
        }

        if(prev.logo) {
            await Archive.fromString(prev.logo).remove();
        }

        let deleterows = await this.delete({ id });
        return res.send(deleterows);
    } catch (error) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

module.exports = controller;
