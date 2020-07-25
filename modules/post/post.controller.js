'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('post');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const { verify_and_upload_image_post, verify_and_upload_image_put, } = require('../../helpers/utilities')


controller.getFunc = async function (req, res) {
    const { id } = req.params;
    const { limit, offset, order, attributes } = req.body;
    const { sequelize } = this.db

    try {
        const post1= `SELECT posts.id, communities.name, 
        CONCAT(users.name,' ',users.last_name) AS fullname, 
        title, posts.content, posts.image, posts.video, posts.file, posts.fixed, 
        COUNT(COALESCE(comments.content, null)) AS count_messages,
        COUNT(CASE WHEN comments.fixed = true THEN 1 END) AS count_likes, 
        posts.active, posts.active, 
                JSON_AGG(tracks.name) as tracks,
                posts."createdAt", posts."updatedAt"
                FROM posts 
                LEFT JOIN users ON posts.id_user = users.id 
                LEFT JOIN communities ON posts.id_community = communities.id
                LEFT JOIN comments ON posts.id = comments.id_post
                LEFT JOIN track_posts ON posts.id = track_posts.id_post
                LEFT JOIN tracks ON tracks.id = track_posts.id_track
                WHERE posts.id =:id
                GROUP BY posts.id, communities.name,fullname`;

        const post2= `SELECT posts.id, communities.name, CONCAT(users.name,' ',users.last_name) AS 
        fullname, title, posts.content, posts.image, posts.video, posts.file, posts.fixed, COUNT(coalesce(comments.content, null)) AS count_messages,
        COUNT(CASE WHEN comments.fixed = true THEN 1 END) AS count_likes, posts.active, posts.active, 
                JSON_AGG(tracks.name) as tracks,
                posts."createdAt", posts."updatedAt"
                FROM posts 
                LEFT JOIN users ON posts.id_user = users.id 
                LEFT JOIN communities ON posts.id_community = communities.id
                LEFT JOIN comments ON posts.id = comments.id_post
                LEFT JOIN track_posts ON posts.id = track_posts.id_post
                LEFT JOIN tracks ON tracks.id = track_posts.id_track
                GROUP BY posts.id, communities.name,fullname`;

        const query_post = id ? post1 : post2        
        const data = await sequelize.query(`${query_post}`, { replacements:{id: id}, type: sequelize.QueryTypes.SELECT });
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

controller.getPostByComment = async function (req, res) {

    const { id_post } = req.params;
    const { limit, offset, order, attributes } = req.body;
    const { Sequelize } = this.db

    try { 
        
        const count = await this.db.comment.findOne({
            limit,
            offset,
            attributes: [ 
                [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN "fixed" = true THEN 1 END')), 'likes'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'messages']
            ]
        });
        const counters = count.toJSON()

        const data_comment = await this.db.comment.findAll({
            limit,
            offset,
            attributes: ['id','id_post','active','content','image','video','file','fixed','reference','createdAt'],
            order,
            where: { id_post },
            include: [
                {
                    attributes: [ [Sequelize.fn('concat', Sequelize.col('name'), ' ', Sequelize.col('last_name')), 'name' ], 'username', ['profile_photo', 'imgUser']],
                    model: this.db.user,
                    as: 'users'
                },
                {
                    attributes: ['id_user','createdAt'],
                    model: this.db.post,
                    as: 'posts',
                    where: { id: id_post },
                }
            ]
        });

        const copy_data = { ...data_comment }
        let data_result = []
        _.forEach(copy_data, function(value, key) {
            const part = value.toJSON()
            const fields = {
                id: part.id,
                user: {
                    alias: part.users.username,
                    author: part.users.name,
                    img_user: part.users.imgUser,
    
                },
                like: part.fixed,
                count_likes: counters.likes,
                count_messages: counters.messages,
                comment: part.content,
                image: [ part.image ? req.headers.host+part.image : null ],
                video: [ part.video ],
                file: [ part.file ]
            }
            data_result.push(fields)
        });
      
        return this.response({
            res,
            payload: [data_result]
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

     
    //const token = req.headers.authorization.split(" ")[1];
    //const decoded = jwt.verify(token, 'secret');
    const { user, user_type, track_post } = this.db;
    //const email = decoded.email;

/* 
    let search_id_user = await user.findOne({
        where: { email }
    });

    const id_user = search_id_user['id'];
    let search_id_community = await user_type.findOne({
        where: { id_user }
    });
 */

    const { id_community, id_user, title, content, active, value, fixed, track } = req.body;

    const img = req.files ? req.files.image: null;
    const vid = req.files ? req.files.video: null;
    const fil = req.files ? req.files.file: null;

    try {
		const image = verify_and_upload_image_post(img,"post_image");
		const video = verify_and_upload_image_post(vid,"post_video");
		const file = verify_and_upload_image_post(fil,"post_file");


        let newdate = await this.insert({
            //id_community: search_id_community['id_community'],
            //id_user: search_id_user['id'],
            id_community,
            id_user,
            title,
            content,
            image,
            video,
            file,
            active,
            value,
            fixed
        });
        const trk  = JSON.parse( track );
        console.log(trk)
        let tracks = [];
        trk.forEach(element => {
            tracks.push({"id_track": element,"id_post": newdate['id']});
        });

        await track_post.bulkCreate(tracks, { returning: true });
          
        if (newdate) {
            return this.response({
                res,
                statusCode: 201,
                payload: newdate
            });
        };
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
    const { id_community, id_user, title, sub_title, content, active, value, fixed, return_data } = req.body;

	let find_image = await this.db.post.findOne({
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

    const image = verify_and_upload_image_put(img,"post_image", fnd_image, rm_image);
    const video = verify_and_upload_image_put(vid,"post_video", fnd_video, rm_video);
    const file = verify_and_upload_image_put(fil,"post_file", fnd_file, rm_file);

    await this.update(
        {
            id,
            data: {
                id_community,
                id_user,        
                title,
                sub_title,
                content,
                image,
                video,
                file, 
                active,
                value,
                fixed
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