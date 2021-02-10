'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('exhibitor');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

controller.getFunc = async function (req, res) {

    const { id } = req.params;
    const { limit, offset, order, attributes } = req.body;
    try {
        const data = await this.getData({
            id,
            limit,
            offset,
            attributes,
            order
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

controller.postFunc = async function (req, res) {

    const { id_partnership, description, id_type_booth, id_event, active } = req.body;
    try {
        let newdate = await this.insert({
            id_partnership,
            description,
            id_type_booth,
            id_event,
            active
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: [newdate]
            });
        }
    } catch (error) {
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { id_partnership, description, id_type_booth, id_event, active, return_data } = req.body;

    try {
        let result = await this.update(
            {
                id,
                data: {
                    id_partnership,
                    description,
                    id_type_booth,
                    id_event,
                    active
                },
                return_data
            });
        if (result) {
            return this.response({
                res,
                statusCode: 200,
                payload: return_data ? result : []
            });
        } else {
            this.response({
                res,
                success: false,
                statusCode: 202,
                message: 'Could not update this element, possibly does not exist'
            });
        }
    } catch (error) {
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong'
        });
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.params;
    try {
        let deleterows = await this.delete({ id });
        if (deleterows > 0) {
            return this.response({
                res,
                success: true,
                statusCode: 200
            });
        } else {
            this.response({
                res,
                success: false,
                statusCode: 202,
                message: 'it was not possible to delete the item because it does not exist'
            });
        }
    } catch (error) {
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong'
        });
    }
}

//-------------special fuctions--------------------

controller.getExhibitorByEvent = async function (req, res) {
    const { id_event } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.exhibitor.findAll({
            limit,
            offset,
            attributes: ['id','description','active'],
            order,
            where: {
				id_event
            },
            include: [
                {
                    attributes: ['id','name', 'description','active','cost','size_width','size_height', 'currency_symbol'],
                    model: this.db.type_booth,
                    as: 'type_booth'
				},
				{
					attributes: ['id','name', 'description', 'active','registry_number', 'logo','host','web'],
                    model: this.db.partnership,
                    as: 'partnership'
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




module.exports = controller;