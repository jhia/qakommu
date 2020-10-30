'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('type_booth');

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

    const { name, description, cost, size_width, size_height, active, currency_symbol, id_community } = req.body;

    if (name == null || cost == null || size_width == null || size_height == null || currency_symbol == null || active == null || id_community == null) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, check the data sent'
        });
    }

    if (size_width <= 0 || size_height <= 0) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the assigned sizes are not valid'
        });
    }


    try {
        let newdate = await this.insert({
            name,
            description,
            cost,
            size_width,
            size_height,
            active,
            currency_symbol,
            id_community
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
    const { name, description, cost, size_width, size_height, active, currency_symbol, id_community, return_data } = req.body;

    if (name == null || cost == null || size_width == null || size_height == null || currency_symbol == null || active == null || id_community == null) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, check the data sent'
        });
    }

    if (size_width <= 0 || size_height <= 0) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the assigned sizes are not valid'
        });
    }


    try {
        let result = await this.update(
            {
                id,
                data: {
                    name,
                    description,
                    cost,
                    size_width,
                    size_height,
                    active,
                    currency_symbol,
                    id_community
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

module.exports = controller;