'use strict'

const Base = require('../../helpers/base.controller');
const { calculateDiscountPercentage } = require('../../helpers/utilities');
const ResponseError = require('../../http/error');
const { sequelize } = require('../../models');
const controller = new Base('ticketSale');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

const validAttributes = ['id', 'ticketId', 'userId', 'count', 'unitAmount', 'totalAmount', 'totalAmountPaid', 'priceType'];

controller.getTicketSaleByTicket = async function (req, res) {
    const { limit, offset } = req.query;
    try {
        const data = await this.model.findAll({
            limit,
            offset,
            attributes: validAttributes,
            where: {
                ticketId: req.ticket.id
            },
            include: [
                {
                    attributes: ['id','name','description'],
                    model: this.db.ticket,
                    as: 'ticket',
                },
                {
                    attributes: ['firstName', 'lastName', 'username', 'profilePhoto'],
                    model: this.db.user,
                    as: 'user'
                },
            ]
        });

        return res.send(data);
    } catch (error) {
        console.log(error)
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError);
    }
}



controller.getOne = async function (req, res) {
    const { ticketSaleId } = req.params;
    try {
        const data = await this.model.findByPk(ticketSaleId, {
            attributes: validAttributes,
            include: [
                {
                    attributes: ['id','name','description'],
                    model: this.db.ticket,
                    as: 'ticket',
                },
                {
                    attributes: ['firstName', 'lastName', 'username', 'profilePhoto'],
                    model: this.db.user,
                    as: 'user'
                },
                {
                    attributes: ['uuid', 'deactivated'],
                    model: this.db.ticketSaleDetail,
                    as: 'details'
                },
            ]
        })
        return res.send(data)
    } catch (error) {
        console.log(error)
        const connectionError = new ResponseError(503, 'Try again later');
        return res.send(connectionError)
    }

}

controller.postFunc = async function (req, res) {
    const { ticketId } = req.params;
    const {
        count,
        totalAmountPaid,
        username // if no user id, then is the auth user
    } = req.body;

    const data = {
        count,
        totalAmountPaid,
        ticketId,
        userId: req.user.id
    };

    const validationError = new ResponseError(400)

    if(isNaN(count) || count < 1) {
        validationError.addContext('count', 'Count is not a valid number')
    }

    if(count > req.ticket.quantityCurrent) {
        validationError.addContext('count', 'Number of tickets exceeds available')
    }

    if(isNaN(totalAmountPaid) || totalAmountPaid < 0) {
        validationError.addContext('totalAmountPaid', 'Amount is not valid')
    }

    if(username) {
        try {
            let user = await this.db.user.findByUsername(username, { attributes: ['id'] })
            if(!user) {
                throw new Error('User does not exist')
            }

            data.userId = user.id
        } catch({ message }) {
            validationError.addContext('username', message)
        }
    }

    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    let price = req.ticket.getCurrentPrice();
    data.unitAmount = price.amount;
    data.totalAmount = price.amount * count;
    data.priceType = price.name;
    
    if(totalAmountPaid > data.totalAmount) {
        validationError.addContext('totalAmountPaid', 'This number exceeds the total amount price')
        return res.send(validationError)
    }

    let transaction = null;
    let connectionError = new ResponseError(503, 'Try again later')

    //generate transaction
    try {
        transaction = await sequelize.transaction();
    } catch (err) {
        return res.send(connectionError)
    }

    // start db queries with transaction
    try {
        let ticketSale = await this.model.create(data, {
            returning: true,
            transaction
        });
        if(!ticketSale) {
            throw new Error('Could not create sale')
        }

        let promises = []
        for(let i = 0; i < count; i++) {
            promises.push(this.db.ticketSaleDetail.create({
                deactivated: false,
                ticketSaleId: ticketSale.id
            }, { transaction }))
        }

        await Promise.all(promises)

        await req.ticket.decrement(['quantityCurrent'], { by: count, transaction })

        await transaction.commit()
        
        res.statusCode = 201
        return res.send(ticketSale)

    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.send(connectionError)
    }
}


// YOU CAN ONLY UPDATE USER ID
controller.putFunc = async function (req, res) {
    const { ticketSaleId } = req.params;

    const { username } = req.body;

    const validationError = new ResponseError(400)
   
    let data = {};

    try {
        let user = await this.db.user.findByUsername(username, { attributes: ['id'] })
        if(!user) {
            throw new Error('User does not exist')
        }

        data.userId = user.id
    } catch({ message }) {
        validationError.addContext('username', message)
    }
    
    if(validationError.hasContext()) {
        return res.send(validationError)
    }

    try {
        let result = await this.update({
            id: ticketSaleId,
            data
        })

        return res.send(result)
    } catch(err) {
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }
}

controller.deleteFunc = async function (req, res) {
    const { ticketSaleId } = req.params;

    let transaction = null;
    let connectionError = new ResponseError(503, 'Try again later')

    //generate transaction
    try {
        transaction = await sequelize.transaction();
    } catch (err) {
        return res.send(connectionError)
    }

    // start db queries with transaction
    try {
        let details = await this.db.ticketSaleDetail.findAll({
            where: {
                ticketSaleId
            },
            attributes: ['id'],
            transaction
        })

        await this.db.ticketSaleDetail.destroy({
            where: {
                id: details.map(d => d.id)
            },
            transaction
        })

        let rows = await this.model.destroy({
            where: {
                id: ticketSaleId
            },
            transaction
        })

        await transaction.commit();

        return res.send(rows);
    } catch (err) {
        await transaction.rollback();
        return res.send(connectionError)
    }

}



module.exports = controller;