'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('message');
const jwt = require('jsonwebtoken');


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
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secret');
    const { user, user_channel } = this.db
    const email = decoded.email
 
    let query = await user.findOne({
        where: { email }
    });
 
    const { message, id_channel, id_message } = req.body;
    try {
        let newdate = await this.insert({
            message,
        });
        
        let newdate2 = await user_channel.create({
            id_channel: 1,
            id_message: newdate['id'],
            id_user: query['id']
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
    const { message } = req.body;
    
    await this.update(
        {
            id,
            data: {
                message                
            },
            return_data
        }            
        )
        .then(( result )=>{
        this.response({
            res,
            statusCode: 200,
            payload: return_data ? result : []
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