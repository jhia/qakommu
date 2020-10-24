'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const { calculateDiscountPercentage } = require('../../helpers/utilities');

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

controller.postFunc = async function (req, res) {
    const { name, description, percentage, id_state, limit, unlimited, id_user_creator, active, since, until, free_use, is_reserved, id_user, id_ticket, id_event, id_sponsor, id_exhibitor } = req.body;
    let uuid;
    if (limit > 0 && unlimited === true) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the data provided is not correct you can check the value of the limit'
        });
    }

    if (unlimited === false && limit === null) {
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

    if (id_sponsor != null && id_exhibitor != null ) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, you cannot assign two roles at the same time'
        });
    }

    if ((id_event != null && id_ticket != null && free_use == false) || (id_event == null && id_ticket == null && free_use == false)) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the binding data entered is not valid'
        });
    }

    if (free_use == true && (id_event != null || id_ticket != null)) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the binding data entered is not valid'
        });
    }


    try {
        let newdate = await this.insert({
            name,
            description,
            percentage,
            id_state,
            limit,
            original_limit: limit,
            unlimited,
            id_user_creator,
            active,
            since,
            until,
            uuid,
            free_use,
            is_reserved,
            id_user,
            id_ticket,
            id_event,
            id_sponsor,
            id_exhibitor
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
    const { name, description, percentage, id_state, limit, unlimited, id_user_creator, active, since, until, free_use, is_reserved, id_user, id_ticket, id_event, id_sponsor, id_exhibitor, return_data } = req.body;

    if (limit > 0 && unlimited === true) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the data provided is not correct you can check the value of the limit'
        });
    }

    if (unlimited === false && limit === null) {
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

    if (id_sponsor != null && id_exhibitor != null ) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, you cannot assign two roles at the same time'
        });
    }

    if ((id_event != null && id_ticket != null && free_use == false) || (id_event == null && id_ticket == null && free_use == false)) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the binding data entered is not valid'
        });
    }

    if (free_use == true && (id_event != null || id_ticket != null)) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong, the binding data entered is not valid'
        });
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
                    until,
                    free_use,
                    is_reserved,
                    id_user,
                    id_ticket,
                    id_event,
                    id_sponsor,
                    id_exhibitor
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

/* ---------- special functions ---------- */

controller.ticketSaleByCoupon = async function (req, res) {
    const { id_coupon } = req.params
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.ticket_sale.findAll({
            limit,
            offset,
            //attributes: ['id', 'name', 'description', 'base_price', 'quantity_total', 'quantity_current'],
            order,
            where: {
                id_coupon
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


controller.searchCouponsByUuid = async function (req, res) {
    const { uuid } = req.params
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.coupon.findOne({
            limit,
            offset,
            attributes: ['id'],
            order,
            where: {
                uuid
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



/*this function is for test */
controller.couponbetweenDate = async function (req, res) {

    const { since, until } = req.params
    const { limit, offset, order } = req.body;
    try {
        const { Op } = require("sequelize");
        let date_since = new Date(since), date_until = new Date(until);
        const data = await this.db.coupon.findAll({
            limit,
            offset,
            //attributes: ['id', 'name', 'description', 'base_price', 'quantity_total', 'quantity_current'],
            order,
            where: {
                [Op.and]: [
                    {
                        since: {
                            [Op.lte]: new Date()
                        }
                    }, {
                        until: {
                            [Op.gte]: new Date()
                        }
                    }]
            }

            /*where: {
                [Op.and]: [
                    {
                        since: {
                            [Op.between]: [date_since, date_until]
                        }
                    }, {
                        until: {
                            [Op.between]: [date_since, date_until]
                        }
                    }]
            }*/


            /*where: {since: 
                {
                    [Op.between]: [date_since, date_until]
                    //[Op.between]: ["2018-07-08T14:06:48.000Z", "2020-09-19T15:05:20.170Z"]
                }
             },*/

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

controller.couponCalculator = async function (req, res) {
    const { p, d } = req.params;
    const base = 100;
    try {
        if (p > 0 && d > 0 && d <= 100) {
            let result = calculateDiscountPercentage(d, p);
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


module.exports = controller;