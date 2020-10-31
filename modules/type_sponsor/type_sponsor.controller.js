'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('type_sponsor');

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
    const { name, description, contribution_value, currency_symbol, id_community, active } = req.body;

    if (name == null || contribution_value == null || currency_symbol == null || active == null || id_community == null) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, check the data sent'
        });
    }

    if (contribution_value < 0) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the contribution cannot be a negative value'
        });
    }

    try {
        let newdate = await this.insert({
            name,
            description,
            contribution_value,
            currency_symbol,
            active,
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
    const { name, description, contribution_value, currency_symbol, active, id_community, return_data } = req.body;

    if (name == null || contribution_value == null || currency_symbol == null || active == null || id_community == null) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, check the data sent'
        });
    }

    if (contribution_value < 0) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the contribution cannot be a negative value'
        });
    }
    try {
        let result = await this.update(
            {
                id,
                data: {
                    name,
                    description,
                    contribution_value,
                    currency_symbol,
                    active,
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

//--------------------sepcial functions--------------------
controller.getTypeSponsorByCommunity = async function (req, res) {
    const { id_community } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.type_sponsor.findAll({
            limit,
            offset,
            attributes: ['id', 'name', 'description', 'contribution_value', 'currency_symbol', 'active', 'id_community'],
            order,
            where: {
                id_community,
                active: true
            }
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