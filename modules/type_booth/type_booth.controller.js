'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('type_booth');

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
        res.json({
            data
        });
    } catch (error) {
        res.status(500).json({
            message: 'something went wrong',
            data: {}
        })
    }

}

controller.postFunc = async function (req, res) {

    const { name, description, cost, size_width, size_height, active } = req.body;
    try {
        let newdate = await this.insert({
            name,
            description,
            cost,
            size_width,
            size_height,
            active
        });
        if (newdate) {
            return res.status(200).json({
                message: 'successful action',
                date: newdate
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'something went wrong',
            date: {}
        });
    }
}

controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, description, cost, size_width, size_height, active } = req.body;
    try {
        let result = await this.update(
            {
                id
            },
            {
                name,
                description,
                cost,
                size_width,
                size_height,
                active
            });
        if (result) {
            res.status(200).json({
                message: "successful action"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'something went wrong',
            date: {}
        });
    }
}

controller.deleteFunc = async function (req, res) {
    const { id } = req.params;
    try {
        let deleterows = await this.delete({ id });
        res.json({
            count: deleterows
        });
    } catch (error) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}

module.exports = controller;