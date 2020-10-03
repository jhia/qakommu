'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('answer');

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

    const { id_question, text, description  } = req.body;
    try {
        if (id_question <= 0 || text.length <= 0) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent.',
            });
        }
        let newdate = await this.insert({
            id_question, text, description
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
    const { id_question, text, description, return_data } = req.body;
    try {
        if (id_question <= 0 || text.length <= 0) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'something went wrong, verify the data sent.',
            });
        }
        let result = await this.update(
            {
                id,
                data: {
                    id_question, text, description
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