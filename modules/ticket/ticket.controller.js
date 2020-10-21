'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const { calculateDiscountPercentage, calculatePercentageIncrease } = require('../../helpers/utilities');

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
		quantity_current, reserved,  limit_sale, max_ticket_sell, start, end,
		use_multiple_price1, since1, until1, percentage1, is_discount1,
		use_multiple_price2, since2, until2, percentage2, is_discount2,
		use_multiple_price3, since3, until3, percentage3, is_discount3,
		use_multiple_price4, since4, until4, percentage4, is_discount4
	} = req.body;
	try {
		if (base_price < 1 || base_price === null || base_price == null || quantity_total < 1 || start == null || end == null) {
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

		if (max_ticket_sell > 0 && limit_sale == false) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, verify the data sent as they do not meet the requirements to be processed.',
			});
		}

		let result1, result2, result3, result4, date_start = new Date(start), date_end = new Date(end), flagformatnull1, flagformatnull2, flagformatnull3, flagformatnull4;
		if (date_end < date_start) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, the end date cannot be less than the start date',
			});
		}
		//multiple price condition 1
		if (use_multiple_price1 && since1 != null && until1 != null && percentage1 != null && is_discount1 != null) {
			let date_since1 = new Date(since1), date_until1 = new Date(until1);
			if ((date_start <= date_since1 && date_end >= date_until1) && (date_since1 <= date_end && date_until1 >= date_start) && (date_until1 > date_since1)) {
				if (is_discount1) {
					result1 = calculateDiscountPercentage(percentage1, base_price);
				} else {
					result1 = calculatePercentageIncrease(percentage1, base_price)
				}

				//multiple price condition 2
				if (use_multiple_price2 && since2 != null && until2 != null && percentage2 != null && is_discount2 != null) {
					let date_since2 = new Date(since2), date_until2 = new Date(until2);
					if ((date_start <= date_since2 && date_end >= date_until2) && (date_since2 <= date_end && date_until2 >= date_start) && (date_since2 > date_until1) && (date_until2 > date_since2)) {
						if (is_discount2) {
							result2 = calculateDiscountPercentage(percentage2, base_price);
						} else {
							result2 = calculatePercentageIncrease(percentage2, base_price)
						}

						//multiple price condition 3
						if (use_multiple_price3 && since3 != null && until3 != null && percentage3 != null && is_discount3 != null) {
							let date_since3 = new Date(since3), date_until3 = new Date(until3);
							if ((date_start <= date_since3 && date_end >= date_until3) && (date_since3 <= date_end && date_until3 >= date_start) && (date_since3 > date_until2) && (date_until3 > date_since3)) {
								if (is_discount3) {
									result3 = calculateDiscountPercentage(percentage3, base_price);
								} else {
									result3 = calculateDiscountPercentage(percentage3, base_price)
								}


								//multiple price condition 4
								if (use_multiple_price4 && since4 != null && until4 != null && percentage4 != null && is_discount4 != null) {

									let date_since4 = new Date(since4), date_until4 = new Date(until4);
									if ((date_start <= date_since4 && date_end >= date_until4) && (date_since4 <= date_end && date_until4 >= date_start) && (date_since4 > date_until3) && (date_until4 > date_since4)) {
										if (is_discount4) {
											result4 = calculateDiscountPercentage(percentage4, base_price);
										} else {
											result4 = calculatePercentageIncrease(percentage4, base_price)
										}
									} else {
										return this.response({
											res,
											success: false,
											statusCode: 500,
											message: 'something went wrong, the dates provided are invalid (4)',
										});
									}

								} else {
									if (use_multiple_price4 && (since4 == null || until4 == null || percentage4 == null || is_discount4 == null)) {
										return this.response({
											res,
											success: false,
											statusCode: 500,
											message: 'something went wrong, the multiple price option does not meet the required data (4)',
										});
									}
								}

							} else {
								return this.response({
									res,
									success: false,
									statusCode: 500,
									message: 'something went wrong, the dates provided are invalid (3)',
								});
							}

						} else {
							if (use_multiple_price3 && (since3 == null || until3 == null || percentage3 == null || is_discount3 == null)) {
								return this.response({
									res,
									success: false,
									statusCode: 500,
									message: 'something went wrong, the multiple price option does not meet the required data (3)',
								});
							}

						}
					} else {
						return this.response({
							res,
							success: false,
							statusCode: 500,
							message: 'something went wrong, the dates provided are invalid (2)',
						});
					}

				} else {
					if (use_multiple_price2 && (since2 == null || until2 == null || percentage2 == null || is_discount2 == null)) {
						return this.response({
							res,
							success: false,
							statusCode: 500,
							message: 'something went wrong, the multiple price option does not meet the required data (2)',
						});
					}

				}

			} else {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the dates provided are invalid (1)',
				});
			}

		} else {
			if (use_multiple_price1 && (since1 == null || until1 == null || percentage1 == null || is_discount1 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data (1)',
				});
			}
		}


		if (!use_multiple_price1 && result1 == null || use_multiple_price1 && result1 == null) {
			flagformatnull1 = true;
		}
		if (!use_multiple_price2 && result2 == null || use_multiple_price2 && result2 == null) {
			flagformatnull2 = true;
		}
		if (!use_multiple_price3 && result3 == null || use_multiple_price3 && result3 == null) {
			flagformatnull3 = true;
		}
		if (!use_multiple_price4 && result4 == null || use_multiple_price4 && result4 == null) {
			flagformatnull4 = true;
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
			reserved_current: reserved,
			limit_sale,
			max_ticket_sell,
			start,
			end,
			//1
			use_multiple_price1: flagformatnull1 ? false : use_multiple_price1,
			price1: result1 ? result1 : null,
			since1: flagformatnull1 ? null : since1,
			until1: flagformatnull1 ? null : until1,
			percentage1: flagformatnull1 ? null : percentage1,
			is_discount1: flagformatnull1 ? null : is_discount1,
			//2
			use_multiple_price2: flagformatnull2 ? false : use_multiple_price2,
			price2: result2 ? result2 : null,
			since2: flagformatnull2 ? null : since2,
			until2: flagformatnull2 ? null : until2,
			percentage2: flagformatnull2 ? null : percentage2,
			is_discount2: flagformatnull2 ? null : is_discount2,
			//3
			use_multiple_price3: flagformatnull3 ? false : use_multiple_price3,
			price3: result3 ? result3 : null,
			since3: flagformatnull3 ? null : since3,
			until3: flagformatnull3 ? null : until3,
			percentage3: flagformatnull3 ? null : percentage3,
			is_discount3: flagformatnull3 ? null : is_discount3,
			//4
			use_multiple_price4: flagformatnull4 ? false : use_multiple_price4,
			price4: result4 ? result4 : null,
			since4: flagformatnull4 ? null : since4,
			until4: flagformatnull4 ? null : until4,
			percentage4: flagformatnull4 ? null : percentage4,
			is_discount4: flagformatnull4 ? null : is_discount4,
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

		if (base_price < 1 || base_price === null || base_price == null || quantity_total < 1 || start == null || end == null) {
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
		
		if (max_ticket_sell > 0 && limit_sale == false) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, verify the data sent as they do not meet the requirements to be processed.',
			});
		}

		let result1, result2, result3, result4, date_start = new Date(start), date_end = new Date(end), flagformatnull1, flagformatnull2, flagformatnull3, flagformatnull4;
		if (date_end < date_start) {
			return this.response({
				res,
				success: false,
				statusCode: 500,
				message: 'something went wrong, the end date cannot be less than the start date',
			});
		}
		//multiple price condition 1
		if (use_multiple_price1 && since1 != null && until1 != null && percentage1 != null && is_discount1 != null) {
			let date_since1 = new Date(since1), date_until1 = new Date(until1);
			if ((date_start <= date_since1 && date_end >= date_until1) && (date_since1 <= date_end && date_until1 >= date_start) && (date_until1 > date_since1)) {
				if (is_discount1) {
					result1 = calculateDiscountPercentage(percentage1, base_price);
				} else {
					result1 = calculateDiscountPercentage(percentage1, base_price)
				}

				//multiple price condition 2
				if (use_multiple_price2 && since2 != null && until2 != null && percentage2 != null && is_discount2 != null) {
					let date_since2 = new Date(since2), date_until2 = new Date(until2);
					if ((date_start <= date_since2 && date_end >= date_until2) && (date_since2 <= date_end && date_until2 >= date_start) && (date_since2 > date_until1) && (date_until2 > date_since2)) {
						if (is_discount2) {
							result2 = calculateDiscountPercentage(percentage2, base_price);
						} else {
							result2 = calculateDiscountPercentage(percentage2, base_price)
						}

						//multiple price condition 3
						if (use_multiple_price3 && since3 != null && until3 != null && percentage3 != null && is_discount3 != null) {
							let date_since3 = new Date(since3), date_until3 = new Date(until3);
							if ((date_start <= date_since3 && date_end >= date_until3) && (date_since3 <= date_end && date_until3 >= date_start) && (date_since3 > date_until2) && (date_until3 > date_since3)) {
								if (is_discount3) {
									result3 = calculateDiscountPercentage(percentage3, base_price);
								} else {
									result3 = calculateDiscountPercentage(percentage3, base_price)
								}


								//multiple price condition 4
								if (use_multiple_price4 && since4 != null && until4 != null && percentage4 != null && is_discount4 != null) {

									let date_since4 = new Date(since4), date_until4 = new Date(until4);
									if ((date_start <= date_since4 && date_end >= date_until4) && (date_since4 <= date_end && date_until4 >= date_start) && (date_since4 > date_until3) && (date_until4 > date_since4)) {
										if (is_discount4) {
											result4 = calculateDiscountPercentage(percentage4, base_price);
										} else {
											result4 = calculateDiscountPercentage(percentage4, base_price)
										}
									} else {
										return this.response({
											res,
											success: false,
											statusCode: 500,
											message: 'something went wrong, the dates provided are invalid (4)',
										});
									}

								} else {
									if (use_multiple_price4 && (since4 == null || until4 == null || percentage4 == null || is_discount4 == null)) {
										return this.response({
											res,
											success: false,
											statusCode: 500,
											message: 'something went wrong, the multiple price option does not meet the required data (4)',
										});
									}
								}

							} else {
								return this.response({
									res,
									success: false,
									statusCode: 500,
									message: 'something went wrong, the dates provided are invalid (3)',
								});
							}

						} else {
							if (use_multiple_price3 && (since3 == null || until3 == null || percentage3 == null || is_discount3 == null)) {
								return this.response({
									res,
									success: false,
									statusCode: 500,
									message: 'something went wrong, the multiple price option does not meet the required data (3)',
								});
							}

						}
					} else {
						return this.response({
							res,
							success: false,
							statusCode: 500,
							message: 'something went wrong, the dates provided are invalid (2)',
						});
					}

				} else {
					if (use_multiple_price2 && (since2 == null || until2 == null || percentage2 == null || is_discount2 == null)) {
						return this.response({
							res,
							success: false,
							statusCode: 500,
							message: 'something went wrong, the multiple price option does not meet the required data (2)',
						});
					}

				}

			} else {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the dates provided are invalid (1)',
				});
			}

		} else {
			if (use_multiple_price1 && (since1 == null || until1 == null || percentage1 == null || is_discount1 == null)) {
				return this.response({
					res,
					success: false,
					statusCode: 500,
					message: 'something went wrong, the multiple price option does not meet the required data (1)',
				});
			}
		}


		if (!use_multiple_price1 && result1 == null || use_multiple_price1 && result1 == null) {
			flagformatnull1 = true;
		}
		if (!use_multiple_price2 && result2 == null || use_multiple_price2 && result2 == null) {
			flagformatnull2 = true;
		}
		if (!use_multiple_price3 && result3 == null || use_multiple_price3 && result3 == null) {
			flagformatnull3 = true;
		}
		if (!use_multiple_price4 && result4 == null || use_multiple_price4 && result4 == null) {
			flagformatnull4 = true;
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
					reserved_current: reserved,
					limit_sale,
					max_ticket_sell,
					start,
					end,
					//1
					use_multiple_price1: flagformatnull1 ? false : use_multiple_price1,
					price1: result1 ? result1 : null,
					since1: flagformatnull1 ? null : since1,
					until1: flagformatnull1 ? null : until1,
					percentage1: flagformatnull1 ? null : percentage1,
					is_discount1: flagformatnull1 ? null : is_discount1,
					//2
					use_multiple_price2: flagformatnull2 ? false : use_multiple_price2,
					price2: result2 ? result2 : null,
					since2: flagformatnull2 ? null : since2,
					until2: flagformatnull2 ? null : until2,
					percentage2: flagformatnull2 ? null : percentage2,
					is_discount2: flagformatnull2 ? null : is_discount2,
					//3
					use_multiple_price3: flagformatnull3 ? false : use_multiple_price3,
					price3: result3 ? result3 : null,
					since3: flagformatnull3 ? null : since3,
					until3: flagformatnull3 ? null : until3,
					percentage3: flagformatnull3 ? null : percentage3,
					is_discount3: flagformatnull3 ? null : is_discount3,
					//4
					use_multiple_price4: flagformatnull4 ? false : use_multiple_price4,
					price4: result4 ? result4 : null,
					since4: flagformatnull4 ? null : since4,
					until4: flagformatnull4 ? null : until4,
					percentage4: flagformatnull4 ? null : percentage4,
					is_discount4: flagformatnull4 ? null : is_discount4,

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