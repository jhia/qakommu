'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const controller = new Base('login');
const db = require('../../models')
const {user,user_type,role,permission,resource} = db

controller.postFunc = async function(req,res){
    const email = req.body.email || '';
    const result = await user.findOne({
        where: {
            email,
            active: true
        },
        include: [{
            model: user_type,
            as: 'user_types',
            include: [{
                model: role,
                as: 'roles',
                include: [{
                    model: permission,
                    as: 'permissions',
                    include: [
                        {
                            model: resource,
                            as: 'resources'
                        }

                    ]
                }]
            }]
        }]
    });

    if (!result) {
        return this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'Incorrect login',
        });
    } else {
        const { password }  = req.body;
        const hash = await bcrypt.compare(password, result.password);

        if (!hash) {
            return this.response({
                res,
                success: false,
                statusCode: 500,
                message: 'Password error',
            });
        }
    }

    const community_id = result.user_types[0].id_community;
    const user_id = result.user_types[0].id_user;
    let User = {
        email: email,
        user_id: user_id,
        community_id: community_id
    };

    User.token = jwt.sign(
        User,
        'secret',
        {
            expiresIn: '30d',
            algorithm: 'HS512',
        }
    );            

    return this.response({
        res,
        statusCode: 200,
        payload: User.token
    });
};

module.exports = controller;