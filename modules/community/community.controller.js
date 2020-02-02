'use strict'

const { makeid } = require('../../helpers/utilities')


const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('community');

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

		return this.response({
			res,
			payload: [data]
		});
    } catch (error) {
		return this.response({
			res,
			success: false,
			statusCode: 500,
			message: 'something went wrong',
		});
    }
}

controller.postFunc = async function (req, res) {

    const { name, description, id_type_of_account, user_acount, web, prefix, member_verification, id_repository , code} = req.body;
    try {
        let newdate = await this.insert({
            name,
            description,
            id_type_of_account,
            user_acount,
            web,
            prefix,
            member_verification,
            id_repository,
            code: makeid(6)
        });
        if (newdate) 
        {
			return this.response({
				res,
				statusCode: 201,
				payload: newdate
			});
        }
    } catch (err) {
		return this.response({
			res,
			success: false,
			statusCode: 500,
			message: err.message,
		});
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, description, id_type_of_account, user_acount, web, prefix, member_verification, id_repository, code } = req.body;
    try {
        let result = await this.update(
            {
                id
            },
            {
                name,
                description,
                id_type_of_account,
                user_acount,
                web,
                prefix,
                member_verification,
                id_repository,
                code
            });

            if (result) {
                return this.response({
                    res,
                    statusCode: 200
                });
            } else {
                return this.response({
                    res,
                    success: false,
                    statusCode: 202,
                    message: 'Could not update this element, possibly does not exist'
                });
            }
        } catch (error) {

		return this.response({
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
		console.log(deleterows);
		if (deleterows > 0) {
			return this.response({
				res,
				success: true,
				statusCode: 200
			});
		} else {
			return this.response({
				res,
				success: false,
				statusCode: 202,
				message: 'it was not possible to delete the item because it does not exist'
			});
		}

	} catch (error) {
		return this.response({
			res,
			success: false,
			statusCode: 500,
			message: 'something went wrong'
		});
	}
}

module.exports = controller;