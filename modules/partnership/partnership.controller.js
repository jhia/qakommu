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
            payload: {data}
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

    const { name, description, registry_number, host, active } = req.body;
	let logo_photo;
    try {


        if (req.files) {

			const {logo} = req.files;
			logo_photo = controller.model.name+"_"+makeid(6)+"."+logo.name.split(".")[logo.name.split(".").length-1]
			logo.mv("./upload/"+logo_photo);
    
        } 

        let newdate = await this.insert({
            name,
            description,
            registry_number,
            logo:"/uploads/"+logo_photo,
            host,
            active
        });
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: {newdate}
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
    const { name, description, registry_number, host, active, return_data } = req.body;

    try {
        const avatar = req.files.logo;
    
        let old_partnership = await this.db.partnership.findOne({
            where: { id }
        });
        if (old_partnership.logo) {
            //console.log(old_partnership.logo.split("/")[2])
            fs.unlinkSync("./upload/"+old_partnership.logo.split("/")[2]);
        }
    
    
        const logo = controller.model.name+"_"+makeid(6)+"."+avatar.name.split(".")[avatar.name.split(".").length-1]
        avatar.mv("./upload/"+logo);
    



        let result = await this.update(
            {
                id,
                data: {
                    name,
                    description,
                    registry_number,
                    logo:"/uploads/"+logo,
                    host,
                    active
                },
                return_data
            });
        if (result) {
            return this.response({
                res,
                statusCode: 200,
                payload: return_data ? { 
                    description,
                    registry_number,
                    logo,
                    host,
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