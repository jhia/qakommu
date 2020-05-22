'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('partnership');
const { makeid } = require('../../helpers/utilities')

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

    const { name, description, registry_number, host, url, active } = req.body;
    let archive;
    let avatar;
    try {

        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
		}
		else {
            avatar = req.files.logo;
            
            archive = "partnership"+"_"+makeid(6)+"."+avatar.name.split(".")[avatar.name.split(".").length-1]
            avatar.mv("./community_name/"+archive);
        }


        let logo = "http://"+req.host+":8000/uploads/"+ archive;

        let newdate = await this.insert({
            name,
            description,
            registry_number,
            logo,
            host,
            url,
            active
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: [newdate]
            });
        }
    } catch (error) {
        console.log(error)
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
    const { name, description, registry_number, logo, host, url, active, return_data } = req.body;

    try {
        let result = await this.update(
            {
                id,
                data: {
                    name,
                    description,
                    registry_number,
                    logo,
                    host,
                    url,
                    active
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