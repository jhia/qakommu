'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('repository_object');
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

    const { description, id_user, id_folder, id_object_type, size, privated, active } = req.body;

    const find_folder = await this.db.folder.findOne({
	where: { id: id_folder },
	attributes: ["id_repository","name"],
	include: [{
	    model: this.db.repository,
	    as: "repository",
	    attributes: ["location"],
	}]
    });
    const dir = find_folder.repository.location+"/"+find_folder.name+"/";

    let name = null;
    try {

        const avatar = req.files ? req.files.name: null;
        name = verify_and_upload_image_post(avatar,"reposotory");
        const archive = name ? name.split("_") : null;

        let newdate = await this.insert({
            name,
            description,
	    id_user,
            id_folder,
            id_object_type,
	    size,
	    privated,
	    active,
        });

        if (newdate) {
            if(name) upload_images(avatar,dir+archive[0],archive[1].split(".")[0]);
            return this.response({
                res,
                statusCode: 201,
                payload: [newdate]
            });
        }
    } catch (error) {
	const { path, value } = error.errors[0];
	if ( path == "name" && value == null ) error.message = "select File"
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: error.message,
        });
    }
}


controller.putFunc = async function (req, res) {
    const { id } = req.params;
    const { name, location, id_repository, id_object_type, return_data } = req.body;
    try {
        let result = await this.update(
            {
                id,
                data: {
                    name,
                    location,
                    id_repository,
                    id_object_type
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
