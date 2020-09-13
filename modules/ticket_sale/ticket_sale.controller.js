'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

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

    const { id_ticket, id_user, count, paying_name, paying_address, dni_payer, name_ticket, name_event, id_coupon } = req.body;
    try {
        if (count < 1 || count === null || count == null || id_ticket < 1 || paying_name.length <= 0 || paying_address.length <= 0 || dni_payer.length <= 0 || name_ticket.length <= 0 || name_event.length <= 0) {
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
                let ticket_total_amount = count * requestedticket.base_price
                let ticket_total_amount_paid = null;
                let ticketsalecoupon, newcouponlimit=0;
                //in this part we are going to verify and calculate the coupon  
                if (id_coupon > 0) {
                    ticketsalecoupon = await this.db.coupon.findOne({
                        where: { id: id_coupon }
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
                        if(ticketsalecoupon.limit <= 0){
                            return this.response({
                                res,
                                success: false,
                                statusCode: 500,
                                message: 'something went wrong, this coupon cannot be used if the limit has been reached',
                            }); 
                        }
                        //coupon calculator
                        if (ticket_total_amount > 0 && ticketsalecoupon.percentage > 0 && ticketsalecoupon.percentage <= 100) {
                            let decimalPercentage = ticketsalecoupon.percentage / 100;
                            let rest = ticket_total_amount * decimalPercentage;
                            ticket_total_amount_paid = ticket_total_amount - rest;
                            if(!ticketsalecoupon.unlimited){
                                newcouponlimit=ticketsalecoupon.limit-1;
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
                    unit_amount: requestedticket.base_price,
                    total_amount: ticket_total_amount,
                    total_amount_paid: ticket_total_amount_paid ? ticket_total_amount_paid : ticket_total_amount,
                    paying_name,
                    paying_address,
                    dni_payer,
                    name_ticket,
                    name_event,
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
                    await this.db.ticket.update({ quantity_current: resultofcurrent }, {
                        where: {
                            id: requestedticket.id
                        }
                    });
                    if(newcouponlimit>-1){
                        await this.db.coupon.update({limit: newcouponlimit},{
                            where:{
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
        console.log("+++++++++++++++++++++++++++");
        console.log(error);
        console.log("+++++++++++++++++++++++++++");
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
    const { id_ticket, id_user, count, unit_amount, total_amount, total_amount_paid, paying_name, paying_address, dni_payer, name_ticket, name_event, id_coupon, return_data } = req.body;
    try {
        let result = await this.update(
            {
                id,
                data: {
                    id_ticket,
                    id_user,
                    count,
                    unit_amount,
                    total_amount,
                    total_amount_paid,
                    paying_name,
                    paying_address,
                    dni_payer,
                    name_ticket,
                    name_event,
                    id_coupon
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