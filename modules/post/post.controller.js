'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('post');
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

        const { user, community, track_post, track, sequelize } = this.db
             
        let query1 = await user.findOne({
            where: { id : data['_previousDataValues']['id_user'] }
        });

        let query2 = await community.findOne({
            where: { id : data['_previousDataValues']['id_community'] }
        });

        const { QueryTypes } = require('sequelize');
        let query3 = await sequelize.query(
            "SELECT name FROM track_posts JOIN tracks ON track_posts.id_track=tracks.id WHERE id_post =  ?",
            {
                replacements: [id],
                type: QueryTypes.SELECT
            }            
        );

        let tracks = []; 
        query3.forEach(element => {
            let x=element['name']
            tracks.push(x)
        });

        let id_community = query2['name'];
        let id_user = query1['name'];
        let title = data['_previousDataValues']['title'];
        let sub_title = data['_previousDataValues']['sub_title'];
        let content = data['_previousDataValues']['content'];
        let active = data['_previousDataValues']['active'];
        let value = data['_previousDataValues']['value'];
        let fixed = data['_previousDataValues']['fixed'];


        return this.response({
            res,
            payload: [{
                community: id_community,
                name_user: id_user,
                title: title,
                sub_title: sub_title,
                content: content,
                active: active,
                value: value,
                fixed: fixed,
                tracks: tracks
            }]
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
    const { user, user_type, track_post } = this.db;
    const email = decoded.email;
 
    let query = await user.findOne({
        where: { email }
    });

    const id_user = query['id'];
    let query2 = await user_type.findOne({
        where: { id_user }
    });

    const { title, sub_title, content, active, value, fixed, track } = req.body;
    try {
        let newdate = await this.insert({
            id_community: query2['id_community'],
            id_user: query['id'],        
            title,
            sub_title,
            content,
            active,
            value,
            fixed
        });
        
        let tracks = [];
        track.forEach(element => {
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

    await this.update(
        {
            id,
            data: {
                id_community,
                id_user,        
                title,
                sub_title,
                content,
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