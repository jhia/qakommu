'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const { calculate_discount_percentage, calculate_percentage_increase } = require('../../helpers/utilities');

const controller = new Base('ticket');

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

	const { name, description, id_state, id_event, base_price, quantity_total,
		quantity_current, reserved, limit_sale, max_ticket_sell, start, end,
		use_multiple_price1, since1, until1, percentage1, is_discount1,
		use_multiple_price2, since2, until2, percentage2, is_discount2,
		use_multiple_price3, since3, until3, percentage3, is_discount3,
		use_multiple_price4, since4, until4, percentage4, is_discount4
	} = req.body;
	try {
		if (base_price < 1 || base_price === null || base_price == null || quantity_total < 1) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, verify the data sent!',
			});
		}
		if (max_ticket_sell <= 0 && limit_sale == true) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, the maximum amount cannot be 0',
			});
		}

		let result1, result2, result3, result4;
		//multiple price condition 1
		if (use_multiple_price1 && since1 != null && until1 != null && percentage1 != null && is_discount1 != null) {

			if (is_discount1) {
				result1 = calculate_discount_percentage(percentage1, base_price);
			} else {
				result1 = calculate_percentage_increase(percentage1, base_price)
			}
		} else {
			if (use_multiple_price1 && (since1 == null || until1 == null || percentage1 == null || is_discount1 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}

		//multiple price condition 2
		if (use_multiple_price2 && since2 != null && until2 != null && percentage2 != null && is_discount2 != null) {

			if (is_discount2) {
				result2 = calculate_discount_percentage(percentage2, base_price);
			} else {
				result2 = calculate_percentage_increase(percentage2, base_price)
			}
		} else {
			if (use_multiple_price2 && (since2 == null || until2 == null || percentage2 == null || is_discount2 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}

		//multiple price condition 3
		if (use_multiple_price3 && since3 != null && until3 != null && percentage3 != null && is_discount3 != null) {

			if (is_discount3) {
				result3 = calculate_discount_percentage(percentage3, base_price);
			} else {
				result3 = calculate_percentage_increase(percentage3, base_price)
			}
		} else {
			if (use_multiple_price3 && (since3 == null || until3 == null || percentage3 == null || is_discount3 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}

		//multiple price condition 4
		if (use_multiple_price4 && since4 != null && until4 != null && percentage4 != null && is_discount4 != null) {

			if (is_discount4) {
				result4 = calculate_discount_percentage(percentage4, base_price);
			} else {
				result4 = calculate_percentage_increase(percentage4, base_price)
			}
		} else {
			if (use_multiple_price4 && (since4 == null || until4 == null || percentage4 == null || is_discount4 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}

		let newdate = await this.insert({
			name,
			description,
			id_state,
			id_event,
			base_price,
			quantity_total,
			quantity_current,
			reserved,
			limit_sale,
			max_ticket_sell,
			start,
			end,
			//1
			use_multiple_price1,
			price1: result1 ? result1 : null,
			since1,
			until1,
			percentage1,
			is_discount1,
			//2
			use_multiple_price2,
			price2: result2 ? result2 : null,
			since2,
			until2,
			percentage2,
			is_discount2,
			//3
			use_multiple_price3,
			price3: result3 ? result3 : null,
			since3,
			until3,
			percentage3,
			is_discount3,
			//4
			use_multiple_price4,
			price4: result4 ? result4 : null,
			since4,
			until4,
			percentage4,
			is_discount4,
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
	const { name, description, id_state, id_event, base_price, quantity_total,
		quantity_current, reserved, limit_sale, max_ticket_sell, start, end, return_data,
		use_multiple_price1, since1, until1, percentage1, is_discount1,
		use_multiple_price2, since2, until2, percentage2, is_discount2,
		use_multiple_price3, since3, until3, percentage3, is_discount3,
		use_multiple_price4, since4, until4, percentage4, is_discount4
	} = req.body;
	try {

		if (base_price < 1 || base_price === null || base_price == null || quantity_total < 1) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, verify the data sent!',
			});
		}
		if (max_ticket_sell <= 0 && limit_sale == true) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, the maximum amount cannot be 0',
			});
		}

		let result1, result2, result3, result4;
		//multiple price condition 1
		if (use_multiple_price1 && since1 != null && until1 != null && percentage1 != null && is_discount1 != null) {

			if (is_discount1) {
				result1 = calculate_discount_percentage(percentage1, base_price);
			} else {
				result1 = calculate_percentage_increase(percentage1, base_price)
			}
		} else {
			if (use_multiple_price1 && (since1 == null || until1 == null || percentage1 == null || is_discount1 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}

		//multiple price condition 2
		if (use_multiple_price2 && since2 != null && until2 != null && percentage2 != null && is_discount2 != null) {

			if (is_discount2) {
				result2 = calculate_discount_percentage(percentage2, base_price);
			} else {
				result2 = calculate_percentage_increase(percentage2, base_price)
			}
		} else {
			if (use_multiple_price2 && (since2 == null || until2 == null || percentage2 == null || is_discount2 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}

		//multiple price condition 3
		if (use_multiple_price3 && since3 != null && until3 != null && percentage3 != null && is_discount3 != null) {

			if (is_discount3) {
				result3 = calculate_discount_percentage(percentage3, base_price);
			} else {
				result3 = calculate_percentage_increase(percentage3, base_price)
			}
		} else {
			if (use_multiple_price3 && (since3 == null || until3 == null || percentage3 == null || is_discount3 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}

		//multiple price condition 4
		if (use_multiple_price4 && since4 != null && until4 != null && percentage4 != null && is_discount4 != null) {

			if (is_discount4) {
				result4 = calculate_discount_percentage(percentage4, base_price);
			} else {
				result4 = calculate_percentage_increase(percentage4, base_price)
			}
		} else {
			if (use_multiple_price4 && (since4 == null || until4 == null || percentage4 == null || is_discount4 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data',
				});
			}
		}


		let result = await this.update(
			{
				id,
				data: {
					name,
					description,
					id_state,
					id_event,
					base_price,
					quantity_total,
					quantity_current,
					reserved,
					limit_sale,
					max_ticket_sell,
					start,
					end,
					//1
					use_multiple_price1,
					price1: result1 ? result1 : null,
					since1,
					until1,
					percentage1,
					is_discount1,
					//2
					use_multiple_price2,
					price2: result2 ? result2 : null,
					since2,
					until2,
					percentage2,
					is_discount2,
					//3
					use_multiple_price3,
					price3: result3 ? result3 : null,
					since3,
					until3,
					percentage3,
					is_discount3,
					//4
					use_multiple_price4,
					price4: result4 ? result4 : null,
					since4,
					until4,
					percentage4,
					is_discount4,

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