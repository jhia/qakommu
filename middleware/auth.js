const jwt = require('jsonwebtoken');
const _ = require('lodash');
const db = require('../models');

const {user,user_type,role,permission,resource,community,event} = db

const permissionsVerification = async function (req, res, next){
    
    if ((req.url).split("/")[1] === "uploads") {
        return next();
    }

    // TODO: REMOVE IT
    if (req.headers.skip) {
        return next();
    }

    // get endpoint from country or language api
    if (/^\/api\/(country|language)\/?/.test(req.url)) {
        return next();
    }

    if(/^\/api\/user\/?$/.test(req.url) && req.method === 'POST') {
        return next();
    }


    try {
        const name_module = (req.url).split("/")    
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        const name_action = req.method
        let community_id

    
        if (name_module[2] === "community") {
            community_id = name_module[3];
        }


        if (name_module[2]=="event" && name_module[3]) {
			let query_event = await event.findOne({
				where: { id: name_module[3] }
			});
            community_id = query_event.id_community;
        }



        if (name_module[2]=="user" && name_module[3]) {
            const result2 = await user.findOne({
				where: { id: name_module[3] },
                include: [{
                    model: user_type,
                    as: 'user_types'
                }]
            });
            community_id = result2.user_types[0].id_community
        }



        const result2 = await user.findOne({
            where: {
                email: decoded.email
            },

            include: [{
                model: user_type,
                as: 'user_types'
            }]
        });




        if (!name_module[3]) {
            community_id = result2.user_types[0].id_community
        }

        if (name_module[3]) {
            community_id = result2.user_types[0].id_community
        }
 

        const result = await user.findOne({
            where: {
                email: decoded.email
            },

            include: [{
                model: user_type,
                as: 'user_types',
 
                where: {
                    id_community: community_id
                },
                 
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
                            },
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
        return url===req.baseUrl;
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