'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const { calculateDiscountPercentage, calculatePercentageIncrease } = require('../../helpers/utilities');
const { ResponseError } = require('../../http');
const { validateDate } = require('../../helpers/validations');

const controller = new Base('ticket');

const validAttributes = [
	'id', 'name', 'description', 'isDraft', 'basePrice',
	'quantityTotal', 'quantityCurrent', 'reserved', 'reservedCurrent',
	'start', 'end', 'limitSale', 'maxTicketSale', 'eventId',
	'useMultiprice1', 'title1', 'since1', 'until1', 'isDiscount1', 'percentage1', 'price1',
	'useMultiprice2', 'title2', 'since2', 'until2', 'isDiscount2', 'percentage2', 'price2',
	'useMultiprice3', 'title3', 'since3', 'until3', 'isDiscount3', 'percentage3', 'price3',
	'useMultiprice4', 'title4', 'since4', 'until4', 'isDiscount4', 'percentage4', 'price4'
]

const multipriceKeys = [
	'useMultiprice1', 'title1', 'since1', 'until1', 'isDiscount1', 'percentage1', 'price1',
	'useMultiprice2', 'title2', 'since2', 'until2', 'isDiscount2', 'percentage2', 'price2',
	'useMultiprice3', 'title3', 'since3', 'until3', 'isDiscount3', 'percentage3', 'price3',
	'useMultiprice4', 'title4', 'since4', 'until4', 'isDiscount4', 'percentage4', 'price4'
]

controller.getFunc = async function (req, res) {
	const { limit, offset } = req.query;
	const { eventId } = req.params;
	try {
		const data = await this.model.findAll({
			where: {
				eventId
			},
			limit,
			offset,
			attributes: validAttributes
		});

		let tickets = data.map(d => {
			let t = {...d.dataValues}
			
			multipriceKeys.forEach(key => delete(t[key]))
			t.prices = d.getPrices()
			return t;
		});
		
		return res.send(tickets)
	} catch (error) {
		console.log(error.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.getOne = async function (req, res) {
	const { ticketId } = req.params;
	try {
		const data = await this.model.findByPk(ticketId, {
			attributes: validAttributes
		});
		let t = data.dataValues
		multipriceKeys.forEach(key => delete(t[key]))
		t.prices = data.getPrices()

		return res.send(t)
	} catch (error) {
		console.log(error.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


controller.postFunc = async function (req, res) {
	const { eventId } = req.params;

	const {
		name,
		description,
		basePrice,
		quantityTotal,
		reserved,
		limitSale,
		maxTicketSale, // required if limitSale is true
		start, //optional
		end, //optional
		price1, // undefined | { active:bool, title:string, since:date, until:date, percentage:float, isDiscount:bool }
		price2, // ...
		price3, // ...
		price4 // ...
	} = req.body;

	const validationError = new ResponseError(400);

	const data = {
		name,
		description,
		basePrice,
		reserved,
		quantityTotal,
		quantityCurrent: quantityTotal,
		limitSale: !!limitSale,
		eventId,
		quantityCurrent: 0
	}

	try {
		if(!(this.model.validateName(name))) {
			throw new Error('Name is not valid')
		}
	} catch({ message }) {
		validationError.addContext('name', message)
	}

	try {
		if(!(this.model.validateDescription(description))) {
			throw new Error('Description is not valid')
		}
	} catch({ message }) {
		validationError.addContext('description', message)
	}

	try {
		if(!(this.model.validateBasePrice(basePrice))) {
			throw new Error('Base price is not valid')
		}
	} catch({ message }) {
		validationError.addContext('basePrice', message)
	}

	try {
		if(!this.model.validateQuantityTotal(quantityTotal)) {
			throw new Error('Quantity total is not valid')
		}
	} catch ({ message }) {
		validationError.addContext('quantityTotal', message)
	}

	if(reserved) {
		try {
			if(!this.model.validateReserved(reserved)) {
				throw new Error('Reserved is not valid');
			}
		} catch({ message }) {
			validationError.addContext('reserved', message)
		}
	}

	if(limitSale) {
		try {
			if(!this.model.validateMaxTicketSale(maxTicketSale)) {
				throw new Error('Max ticket sale is not valid')
			}
			data.maxTicketSale = maxTicketSale;
		} catch ({ message }) {
			validationError.addContext('maxTicketSale', message)
		}
	}

	if(start) {
		try {
			if(!validateDate(start)) {
				throw new Error('Start date must be in yyyy-mm-ddTHH:MM:SSZ format')
			}
			data.start = new Date(start);
		} catch ({ message }) {
			validationError.addContext('start', message)
		}
	} else {
		data.start = new Date()
	}

	if(end) {
		try {
			if(!validateDate(end)) {
				throw new Error('Start date must be in yyyy-mm-ddTHH:MM:SSZ format')
			}
			if(data.start && (new Date(end)).getTime() < data.start.getTime()) {
				throw new Error('End date cannot be less than start date')
			}
			data.end = new Date(end);
		} catch ({ message }) {
			validationError.addContext('end', message)
		}
	}

	// first, make sure is a valid base price
	if(validationError.hasContext()){
		return res.send(validationError)
	}

	let multiprices = [price1, price2, price3, price4];

	for(let i = 0; i < multiprices.length; i++) {
		if(multiprices[i]) {
			if(i === 0 || multiprices[i - 1].active) {
				data[`useMultiprice${i + 1}`] = multiprices[i].active;
				if(multiprices[i].active) {
					let priceErrors = {};
					data[`title${i + 1}`] = multiprices[i].title;
					try {
						if(!validateDate(multiprices[i].since)) {
							throw new Error('Since date is not valid')
						}
						data[`since${i + 1}`] = multiprices[i].since;
					} catch ({ message }) {
						priceErrors.since = message;
					}

					try {
						if(!validateDate(multiprices[i].until)) {
							throw new Error('Until date is not valid')
						}
						if(!priceErrors.hasOwnProperty('since') &&
							(new Date(multiprices[i].since)).getTime() > (new Date(multiprices[i].until)).getTime()) {
							throw new Error('Until date cannot be less than since date')
						}
						data[`until${i + 1}`] = multiprices[i].until;
					} catch ({ message }) {
						priceErrors.until = message;
					}

					data[`percentage${i + 1}`] = multiprices[i].percentage;

					if(Object.keys(priceErrors).length > 0) {
						validationError.addContext(`price${i + 1}`, priceErrors)
					} else {
						data[`price${i + 1}`] = multiprices[i].isDiscount ?
							calculateDiscountPercentage(multiprices[i].percentage, basePrice) :
							calculatePercentageIncrease(multiprices[i].percentage, basePrice);
					}
				}
			} else { // activate only if the previous one is active
				multiprices[i].active = false
			}
		} else {
			multiprices[i] = { active: false }
		}
	}

	// then, make sure it has valid multiprice data
	if(validationError.hasContext()){
		return res.send(validationError)
	}

	try {
		let result = await this.insert(data)
		return res.send(result)
	} catch (err) {
		console.log(err.message)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


controller.putFunc = async function (req, res) {

	let data = {};

	const validationError = new ResponseError(400)

	if(req.body.name) {
		try {
			if(!(this.model.validateName(req.body.name))) {
				throw new Error('Name is not valid')
			}
			data.name = req.body.name;
		} catch({ message }) {
			validationError.addContext('name', message)
		}
	}

	if(req.body.description) {
		try {
			if(!(this.model.validateDescription(req.body.description))) {
				throw new Error('Description is not valid')
			}
			data.description = req.body.description;
		} catch({ message }) {
			validationError.addContext('description', message)
		}
	}

	if(req.body.basePrice) {
		try {
			if(!(this.model.validateBasePrice(req.body.basePrice))) {
				throw new Error('Base price is not valid')
			}
			data.basePrice = req.body.basePrice
		} catch({ message }) {
			validationError.addContext('name', message)
		}
	}

	if(req.body.quantityTotal) {
		try {
			if(!this.model.validateQuantityTotal(req.body.quantityTotal)) {
				throw new Error('Quantity total is not valid')
			}
			data.quantityTotal = req.body.quantityTotal
		} catch ({ message }) {
			validationError.addContext('quantityTotal', message)
		}
	}

	if(req.body.hasOwnProperty('limitSale')) {
		data.limitSale = !!req.body.limitSale;
	}

	if(req.body.maxTicketSale) {
		try {
			if(!this.model.validateMaxTicketSale(req.body.maxTicketSale)) {
				throw new Error('Max ticket sale is not valid')
			}
			data.maxTicketSale = req.body.maxTicketSale;
		} catch ({ message }) {
			validationError.addContext('maxTicketSale', message)
		}
	}

	if(req.body.start) {
		try {
			if(!validateDate(req.body.start)) {
				throw new Error('Start date must be in yyyy-mm-ddTHH:MM:SSZ format')
			}
			data.start = new Date(req.body.start);
		} catch ({ message }) {
			validationError.addContext('start', message)
		}
	}

	if(req.body.end) {
		try {
			if(!validateDate(req.body.end)) {
				throw new Error('Start date must be in yyyy-mm-ddTHH:MM:SSZ format')
			}
			if(data.start && (new Date(req.body.end)).getTime() < data.start.getTime()) {
				throw new Error('End date cannot be less than start date')
			}
			data.end = new Date(req.body.end);
		} catch ({ message }) {
			validationError.addContext('end', message)
		}
	}

	// first, make sure is a valid base price
	if(validationError.hasContext()){
		return res.send(validationError)
	}

	if(req.body.prices) {

		let { price1, price2, price3, price4} = req.body.prices;

		let multiprices = [price1, price2, price3, price4];

		for(let i = 0; i < multiprices.length; i++) {
			if(i === 0 || multiprices[i - 1].active) {
				data[`useMultiprice${i + 1}`] = multiprices[i].active;
				if(multiprices[i].active) {
					let priceErrors = {};
					data[`title${i + 1}`] = multiprices[i].title;
					try {
						if(!validateDate(multiprices[i].since)) {
							throw new Error('Since date is not valid')
						}
						data[`since${i + 1}`] = multiprices[i].since;
					} catch ({ message }) {
						priceErrors.since = message;
					}

					try {
						if(!validateDate(multiprices[i].until)) {
							throw new Error('Until date is not valid')
						}
						if(!priceErrors.hasOwnProperty('since') &&
							(new Date(multiprices[i].since)).getTime() > (new Date(multiprices[i].until)).getTime()) {
							throw new Error('Until date cannot be less than since date')
						}
						data[`until${i + 1}`] = multiprices[i].until;
					} catch ({ message }) {
						priceErrors.until = message;
					}

					data[`percentage${i + 1}`] = multiprices[i].percentage;

					if(Object.keys(priceErrors).length > 0) {
						validationError.addContext(`price${i + 1}`, priceErrors)
					} else {
						data[`price${i + 1}`] = multiprices[i].isDiscount ?
							calculateDiscountPercentage(multiprices[i].percentage, req.ticket.basePrice) :
							calculatePercentageIncrease(multiprices[i].percentage, req.ticket.basePrice);
					}
				}
			} else { // activate only if the previous one is active
				multiprices[i].active = false
			}
		}
	}
	// then, make sure it has valid multiprice data
	if(validationError.hasContext()){
		return res.send(validationError)
	}

	if(Object.keys(data).length === 0) {
		// no data to process
		res.statusCode = 202
		return res.send()
	}

	try {
		let result = await this.update({
			id: req.ticket.id,
			data
		});
		return res.send(result)
	} catch(err) {
		console.log(err)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}

controller.deleteFunc = async function (req, res) {
	const { ticketId } = req.params;
	try {
		let deleterows = await this.delete(ticketId);
		return res.send(deleterows);
	} catch (err) {
		console.log(err)
		const connectionError = new ResponseError(503, 'Try again later')
		return res.send(connectionError)
	}
}


module.exports = controller;