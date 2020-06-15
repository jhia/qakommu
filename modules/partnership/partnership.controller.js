'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('partnership');
const { makeid } = require('../../helpers/utilities')

const fs = require('fs');

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
    let logo_photo;
    try {
        const host = req.headers.host


        const avatar = req.files ? req.files.logo: null;
        const logo = verify_and_upload_image_post(avatar,"any_name");


/* 
        if (req.files) {
            const { logo } = req.files;
            logo_photo = controller.model.name + "_" + makeid(6) + "." + logo.name.split(".")[logo.name.split(".").length - 1]
            logo.mv("./upload/" + logo_photo);

        }
 */




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
    const { name, description, registry_number, active, web, update_logo, remove_logo, return_data } = req.body;
    try {

        let find_image = await this.db.partnership.findOne({
            where: { id }
        });
    
        const fnd_image = find_image ? find_image.profile_photo : null
        const avatar = req.files ? req.files.logo : null;
        const rm_image = remove_image ? remove_image : 0; // 1: remove image
    
        const logo = verify_and_upload_image_put( avatar, "any_name", fnd_image, rm_image );
    
        




/* 
        const avatar = req.files.logo;
        let logo;
        if (update_logo == "true") {
            console.log('paso1')
            let old_partnership = await this.db.partnership.findOne({
                where: { id }
            });
            if (old_partnership.logo) fs.unlinkSync("./upload/" + old_partnership.logo.split("/")[2]);
            logo = "/uploads/" + controller.model.name + "_" + makeid(6) + "." + avatar.name.split(".")[avatar.name.split(".").length - 1]
            avatar.mv("./upload/" + logo.split("/")[2]);
        }else {
            if (remove_logo == "true") {
                logo = null
    
                let old_partnership = await this.db.partnership.findOne({
                    where: { id }
                });
                if (old_partnership.logo) fs.unlinkSync("./upload/" + old_partnership.logo.split("/")[2]);
    
            }else{
                let old_partnership = await this.db.partnership.findOne({
                    where: { id }
                });
                logo = old_partnership.logo;
            }
        }
 */




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