'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('sponsor');
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
	const { id_partnership, description, id_type_sponsor, id_event, active } = req.body;
	let image = null;
	try {
		const host = req.headers.host
        const avatar = req.files ? req.files.image: null;
        image = verify_and_upload_image_post(avatar,"sponsor");
        const archive = image ? image.split("_") : null;

		let newdate = await this.insert({
			id_partnership,
			description, 
			id_type_sponsor, 
			id_event, 
			active,
			image,
			host
		});
		if (newdate) {
			if(image) upload_images(avatar,archive[0],archive[1].split(".")[0]);
			return this.response({
				res,
				statusCode: 201,
				payload: [newdate]
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
	const { id_partnership, description, id_type_sponsor, id_event, active, return_data } = req.body;
	let find_image = await this.db.sponsor.findOne({
        where: { id }
    });
    const fnd_image = find_image.image ? find_image.image : null;
    const avatar = req.files ? req.files.image : undefined;
    let image = avatar && verify_and_upload_image_put(avatar, "sponsor", fnd_image);
    if(req.body.image == 'not-image') image = null;

	const archive = image ? image.split("_") : null;
	
	try {
		let result = await this.update(
			{
				id,
				data: {
					id_partnership, 
					description, 
					id_type_sponsor, 
					id_event, 
					active,
					image
				},
				return_data
			});
		if (result) {
			if(fnd_image && image) delete_image(fnd_image);
            if(req.body.image == 'not-image' && fnd_image) delete_image(fnd_image);
            if(image) upload_images(avatar,archive[0],archive[1].split(".")[0]);
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
		let find_image = await this.db.sponsor.findOne({
            where: { id }
        });
        if (find_image.image) delete_image(find_image.image);

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

//-------------special fuction--------------------
controller.getSponsorByEvent = async function (req, res) {
    const { id_event } = req.params;
    const { limit, offset, order } = req.body;
    try {
        const data = await this.db.sponsor.findAll({
            limit,
            offset,
            attributes: ['id', 'description','active'],
            order,
            where: {
				id_event
            },
            include: [
                {
                    attributes: ['id','name', 'description','active','contribution_value','currency_symbol'],
                    model: this.db.type_sponsor,
                    as: 'type_sponsor'
				},
				{
					attributes: ['id','name', 'description', 'registry_number', 'active' ,'logo','host','web'],
                    model: this.db.partnership,
                    as: 'partnership'
				}
            ]
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


module.exports = controller;