'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('comment');
const jwt = require('jsonwebtoken');
const { verify_and_upload_image_post, verify_and_upload_image_put, } = require('../../helpers/utilities')

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
            payload: [ data ]
            
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
    const { user } = this.db
    const email = decoded.email
 
    let query = await user.findOne({
        where: { email }
    });

    const { id_post, active, content, fixed, reference } = req.body;

    const img = req.files ? req.files.image: null;
    const vid = req.files ? req.files.video: null;
    const fil = req.files ? req.files.file: null;
    try {
		const image = verify_and_upload_image_post(img,"comment_image");
		const video = verify_and_upload_image_post(vid,"comment_video");
		const file = verify_and_upload_image_post(fil,"comment_file");

        let newdate = await this.insert({
            id_user: query['id'], 
            id_post, 
            active, 
            content, 
            image,
            video,
            file, 
            fixed,
            reference
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
    const { id_post, active, content, fixed, reference, return_data, remove_image, remove_video, remove_file } = req.body;




	let find_image = await this.db.comment.findOne({
		where: { id }
	});

	const fnd_image = find_image ? find_image.image : null
	const fnd_video = find_image ? find_image.video : null
	const fnd_file = find_image ? find_image.file : null

    const img = req.files ? req.files.image: null;
    const vid = req.files ? req.files.video: null;
    const fil = req.files ? req.files.file: null;

	const rm_image = remove_image ? remove_image : '0';
	const rm_video = remove_video ? remove_video : '0';
	const rm_file = remove_file ? remove_file : '0';

    const image = verify_and_upload_image_put(img,"comment_image", fnd_image, rm_image);
    const video = verify_and_upload_image_put(vid,"comment_video", fnd_video, rm_video);
    const file = verify_and_upload_image_put(fil,"comment_file", fnd_file, rm_file);







    await this.update(
        {
            id,
            data: {
                id_post, 
                active, 
                content, 
                fixed, 
                image,
                video,
                file, 
                reference 
            },
            return_data
        })
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