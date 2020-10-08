'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const { calculateDiscountPercentage } = require('../../helpers/utilities');
const controller = new Base('ticket_sale');

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

    const { id_ticket, id_user, count, paying_name, paying_address, dni_payer, name_ticket, id_coupon } = req.body;

    try {
        if (count < 1 || count === null || count == null || id_ticket < 1 || paying_name.length <= 0 || paying_address.length <= 0 || dni_payer.length <= 0 || name_ticket.length <= 0) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent!',
            });
        } else {
            //in this step we are going to verify the actual data of the ticket
            const requestedticket = await this.db.ticket.findOne({
                where: { id: id_ticket }
            });

            if (!requestedticket) {
                return this.response({
                    res,
                    success: false,
                    statusCode: 500,
                    message: 'something went wrong, the selected ticket is not available',
                });
            } else {
                //in this part we are going to check availability according to the number of tickets
                if (count > requestedticket.quantity_current || count > requestedticket.max_ticket_sell) {
                    return this.response({
                        res,
                        success: false,
                        statusCode: 500,
                        message: 'the amount of ticket you want to buy exceeds stock',
                    });
                }
                //start calculate price to ticket
                let price_current, price_type_current, today = new Date();

                if (requestedticket.use_multiple_price1 == true && (requestedticket.since1 <= today && requestedticket.until1 >= today)) {
                    price_current = requestedticket.price1;
                    price_type_current = "P1";
                } else {
                    if (requestedticket.use_multiple_price2 == true && (requestedticket.since2 <= today && requestedticket.until2 >= today)) {
                        price_current = requestedticket.price2;
                        price_type_current = "P2";
                    } else {
                        if (requestedticket.use_multiple_price3 == true && (requestedticket.since3 <= today && requestedticket.until3 >= today)) {
                            price_current = requestedticket.price3;
                            price_type_current = "P3";
                        } else {
                            if (requestedticket.use_multiple_price4 == true && (requestedticket.since4 <= today && requestedticket.until4 >= today)) {
                                price_current = requestedticket.price4;
                                price_type_current = "P4";
                            } else {
                                price_current = requestedticket.base_price;
                                price_type_current = "PB";
                            }
                        }
                    }
                }

                //end calculate price to ticket

                let ticket_total_amount = count * price_current
                let ticket_total_amount_paid = ticket_total_amount;
                let ticketsalecoupon, newcouponlimit = 0, flagcouponlimit = false;
                //in this part we are going to verify and calculate the coupon  
                if (id_coupon > 0) {
                    const { Op } = require("sequelize");
                    ticketsalecoupon = await this.db.coupon.findOne({
                        where: {
                            id: id_coupon,
                            [Op.and]: [
                                {
                                    since: {
                                        [Op.lte]: today
                                    }
                                }, {
                                    until: {
                                        [Op.gte]: today
                                    }
                                }]

                        }
                    });
                    if (!ticketsalecoupon) {
                        return this.response({
                            res,
                            success: false,
                            statusCode: 500,
                            message: 'something went wrong, the coupon is not available',
                        });
                    } else {

                        //coupon limit verification
                        if (ticketsalecoupon.limit <= 0 && ticketsalecoupon.unlimited === false) {
                            return this.response({
                                res,
                                success: false,
                                statusCode: 500,
                                message: 'something went wrong, this coupon cannot be used if the limit has been reached',
                            });
                        }
                        //coupon calculator
                        if (ticket_total_amount > 0 && ticketsalecoupon.percentage > 0 && ticketsalecoupon.percentage <= 100) {

                            ticket_total_amount_paid = calculateDiscountPercentage(ticketsalecoupon.percentage, ticket_total_amount);
                            if (!ticketsalecoupon.unlimited) {
                                newcouponlimit = ticketsalecoupon.limit - 1;
                                flagcouponlimit = true;
                            }
                        } else {
                            return this.response({
                                res,
                                success: false,
                                statusCode: 500,
                                message: 'something went wrong',
                            });
                        }
                    }
                }

                let newdate = await this.insert({
                    id_ticket,
                    id_user,
                    count,
                    unit_amount: price_current,
                    total_amount: ticket_total_amount,
                    total_amount_paid: ticket_total_amount_paid,
                    paying_name,
                    paying_address,
                    dni_payer,
                    name_ticket: requestedticket.name,
                    price_type: price_type_current,
                    id_coupon
                });

                if (newdate.id > 0) {
                    let i;
                    let uuid;
                    let id_ticket_sale = newdate.id;
                    let deactivated = false;
                    for (i = 0; i < count; i++) {
                        await this.db.ticket_sale_detail.create({
                            uuid, id_ticket_sale, deactivated
                        });
                    }
                    //we subtract the amount purchased with the availability of tickets
                    let resultofcurrent = requestedticket.quantity_current - count
                    //in this part we update the current amount of ticket
                    if (resultofcurrent == 0) { //in this part  status change to Sold Out (id=2)
                        await this.db.ticket.update({ quantity_current: resultofcurrent, id_state: 2 }, {
                            where: {
                                id: requestedticket.id
                            }
                        });
                    } else {
                        await this.db.ticket.update({ quantity_current: resultofcurrent }, {
                            where: {
                                id: requestedticket.id
                            }
                        });
                    }


                    if (flagcouponlimit) {
                        await this.db.coupon.update({ limit: newcouponlimit }, {
                            where: {
                                id: ticketsalecoupon.id
                            }
                        });
                    }

                } else {
                    return this.response({
                        res,
                        success: false,
                        statusCode: 500,
                        message: 'something went wrong',
                    });
                }

                return this.response({
                    res,
                    statusCode: 201,
                    payload: [newdate]
                });
            }
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
    const { id_user, paying_name, paying_address, dni_payer, return_data } = req.body;
    try {
        if (paying_name.length <= 0 || paying_address.length <= 0 || dni_payer.length <= 0) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent!',
            });
        } else {

        }
        let result = await this.update(
            {
                id,
                data: {
                    id_user,
                    paying_name,
                    paying_address,
                    dni_payer
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
        console.log(error);
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