'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('coupon');

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
            message: 'something went wrong'
        });
    }

}

controller.couponCalculator = async function (req, res) {
    const { p, d } = req.params;
    const base = 100;
    try {
        if (p > 0 && d > 0 && d <= 100) {
            let decimalPercentage = d / base;
            let rest = p * decimalPercentage;
            let result = p - rest;
            return this.response({
                res,
                statusCode: 201,
                payload: [result]
            });
        } else {
            this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'Does not comply with the indicated format.'
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

controller.postFunc = async function (req, res) {
    const { name, description, percentage, id_state, limit, unlimited, id_user_creator, active, since, until } = req.body;
    let uuid;
    if(limit > 0 && unlimited === true)
    {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the data provided is not correct you can check the value of the limit'
        });
    }

    if(unlimited === false && limit === null ){
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the data provided is not correct you can check the value of the limit'
        });
    }

    if ((since != null && until == null) || (since != null && until === null) || (until != null && since == null) || (until != null && since === null)) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, incomplete date range data'
        });
    } else {
        let date_since = new Date(since), date_until = new Date(until);
        if (date_since > date_until) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, dates entered are not valid'
            });
        }
    }

    
    try {
        let newdate = await this.insert({
            name,
            description,
            percentage,
            id_state,
            limit,
            original_limit : limit,
            unlimited,
            id_user_creator,
            active,
            since,
            until,
            uuid
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
    const { name, description, percentage, id_state, limit, unlimited, id_user_creator, active, since, until, return_data } = req.body;

    if ((since != null && until == null) || (since != null && until === null) || (until != null && since == null) || (until != null && since === null)) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, incomplete date range data'
        });
    } else {
        let date_since = new Date(since), date_until = new Date(until);
        if (date_since > date_until) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, dates entered are not valid'
            });
        }
    }

    try {
        let result = await this.update(
            {
                id,
                data: {
                    name,
                    description,
                    percentage,
                    id_state,
                    limit,
                    unlimited,
                    id_user_creator,
                    active,
                    since,
                    until
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