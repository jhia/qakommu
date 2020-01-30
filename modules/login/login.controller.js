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
        this.response({
            res,
            success: false,
            statusCode: 500,
            message: 'something went wrong',
        });
    } else {
        const { password }  = req.body;
        const hash = await bcrypt.compare(password, result.password);
    }



    
    let User = {
        email
    };

    User.token = jwt.sign(
        User,
        'secret',
        {
            expiresIn: '1y',
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