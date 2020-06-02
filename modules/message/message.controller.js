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

const ver = async function (req,channel) {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secret');
    let id_community = decoded.community_id

    let data = await channel.findOne({
        where: { id_community }
    });

    return data.id;
}


controller.getMessageByChannel = async function (req, res) {
    
    const { id } = req.params;
    const { limit, offset, order, attributes } = req.body;
    const { message, user_channel, channel } = this.db

    const id_channel = await ver(req, channel); 

	try {

		const data  = await message.findAll({
            id,
            limit,
			offset,
            order,
            attributes,
			include: [
                {
                    where: { id_channel },
                    attributes,
                    model: user_channel,
                    as: 'messages',
                 },
            ]
        });

		this.response({
			res,
			payload: {
                data,
            }
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
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secret');
    const { user, user_channel, channel } = this.db
    const email = decoded.email
    const channel_id = await ver(req, channel); 
 
    let query = await user.findOne({
        where: { email }
    });
 
    const { message, reference } = req.body;
    try {
        let newdate = await this.insert({
            message,
            reference
        });
        
        let newdate2 = await user_channel.create({
            id_channel: channel_id,
            id_message: newdate['id'],
            id_user: query['id']
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: {
                    id: newdate.id,
                    id_channel: newdate2.id_channel,
                    id_user: newdate2.id_user,
                    message: newdate.message,
                    reference: newdate.reference
                }
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