'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('partnership');
const { verify_and_upload_image_post, verify_and_upload_image_put, delete_image } = require('../../helpers/utilities')

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
            payload: { data }
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
    const { name, description, registry_number, web, active } = req.body;

    try {
        const host = req.headers.host
        const avatar = req.files ? req.files.logo: null;
        const logo = verify_and_upload_image_post(avatar,"partnership");

        let newdate = await this.insert({
            name,
            description,
            registry_number,
            logo,
            host,
            web,
            active
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: { newdate }
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
    const { name, description, registry_number, active, web, return_data, remove_image } = req.body;
    try {

        let find_image = await this.db.partnership.findOne({
            where: { id }
        });
    
        const fnd_image = find_image ? find_image.logo : null
        const avatar = req.files ? req.files.logo : null;
        const rm_image = remove_image ? remove_image : 0;
    
        const logo = verify_and_upload_image_put( avatar, "partnership", fnd_image, rm_image );
    
        let result = await this.update(
            {
                id,
                data: {
                    name,
                    description,
                    registry_number,
                    logo,
                    web,
                    active
                },
                return_data
            });
        if (result) {
            return this.response({
                res,
                statusCode: 200,
                payload: return_data ? {
                    name,
                    description,
                    registry_number,
                    logo,
                    web,
                    active
                } : []
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

        let find_image = await this.db.partnership.findOne({
            where: { id }
        });
         
        delete_image( find_image.logo.split("/")[2] );
    

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