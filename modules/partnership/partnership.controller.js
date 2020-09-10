'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('partnership');
const { verify_and_upload_image_post, verify_and_upload_image_put, delete_image, upload_images } = require('../../helpers/utilities')

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
        const data1 = await this.getData({
            id,
            limit,
            offset,
            attributes,
            order
        });

        const update_logo_path = x => x.map(x => {
            x.logo = x.logo && '/uploads/' + x.logo;
            return x;
        })

        data1.logo = data1.logo && '/uploads/' + data1.logo;

        this.response({
            res,
            payload: id ? data1 : update_logo_path(data1)
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

    let logo = null;
    try {
        const host = req.headers.host
        const avatar = req.files ? req.files.logo: null;
        logo = verify_and_upload_image_post(avatar,"partnership");
        const archive = logo ? logo.split("_") : null;

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
            if(logo) upload_images(avatar,archive[0],archive[1].split(".")[0]);
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
    const { name, description, registry_number, active, web, return_data } = req.body;
    let find_image = await this.db.partnership.findOne({
        where: { id }
    });
    const fnd_image = find_image.logo ? find_image.logo : null;
    const avatar = req.files ? req.files.logo : undefined;
    let logo = avatar && verify_and_upload_image_put(avatar, "partnership", fnd_image);
    if(req.body.logo == 'not-image') logo = null;

    const archive = logo ? logo.split("_") : null;
   try {

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
            if(fnd_image && logo) delete_image(fnd_image);
            if(req.body.logo == 'not-image') delete_image(fnd_image);
            if(logo) upload_images(avatar,archive[0],archive[1].split(".")[0]);
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
        if (find_image.logo) delete_image(find_image.logo);


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
