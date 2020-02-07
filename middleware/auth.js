const jwt = require('jsonwebtoken');
const _ = require('lodash');
const db = require('../models');

const {user,user_type,role,permission,resource} = db

const permissionsVerification = async function (req, res, next){
    // para saltarse el auth
    console.log(req.url);
    if (req.headers.skip) {
        return next();
    }


    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        const name_action = req.method
        const name_module = (req.url).split("/")    

        const result = await user.findOne({
            where: {
                email: decoded.email
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
                        include: [{
                            model: resource,
                            as: 'resources',
                            where: {
                                name: name_module
                            }
                        }]
                            
                    }],
                    
                }],            

            }]
        });    


    function validate(){

        const { _create, _read, _update, _delete } = result.user_types[0].roles.permissions[0]


        switch (name_action.toUpperCase()) {
            case 'POST':
                return _create;
                break;
        
            case 'GET':
                return _read;
                    break;
       
            case 'PUT':
                return _update;
                    break;

            case 'DELETE':
                return _delete;
                    break;
        }

    }

    if (!validate()) {
        return url==req.baseUrl;
    }
    else{
        req.userData = decoded;
    }

    next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}

module.exports = permissionsVerification;