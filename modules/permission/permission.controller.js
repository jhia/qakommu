'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('permission');

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

    const { id_role, id_resource, _create, _read, _update, _delete } = req.body;
    try {
        let newdate = await this.insert({
            id_role, 
            id_resource, 
            _create, 
            _read, 
            _update, 
            _delete
        });
        if (newdate) {
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
    const { id_role, id_resource, _create, _read, _update, _delete } = req.body;

    await this.update(
        {
            id,
            data: {

                id_role, 
                id_resource, 
                _create, 
                _read, 
                _update, 
                _delete
            },
            return_data
        }            
        )
        .then(( result )=>{
            this.response({
                res,
                statusCode: 200,
                payload: return_data ? req.body : []
            })
        }).catch((err)=>{
            this.response({
                res,
                success: false,
                statusCode: 500,
                message: err.message
            })
        });
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