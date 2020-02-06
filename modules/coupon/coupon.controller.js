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

controller.postFunc = async function (req, res) {

    const { name, description, free, percentage, id_state, applicable_amount, applicable_total_amount,id_user, active} = req.body;
    try {
        let newdate = await this.insert({
            name,
            description,
            free,
            percentage,
            id_state,
            applicable_amount,
            applicable_total_amount,
            //id_user,
            active,
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
    const { name, description, free, percentage, id_state, applicable_amount, applicable_total_amount,id_user, active} = req.body;
    try {
        let result = await this.update(
            {
                id
            },
            {
                name, 
                description, 
                free, percentage, 
                id_state, 
                applicable_amount, 
                applicable_total_amount,
                //id_user, 
                active
            });
            if (result) {
                return this.response({
                    res,
                    statusCode: 200
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