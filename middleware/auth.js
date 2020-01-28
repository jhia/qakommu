const jwt = require('jsonwebtoken');
const _ = require('lodash');
const db = require('../models');

const {user,user_type,rol,permission,resource,action} = db

const permissionsVerification = async function (req, res, next){

try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secret');

    const result = await user.findOne({
        where: {
            email: decoded.email
        },
        include: [{
            model: user_type,
            as: 'user_types',
            include: [{
                model: rol,
                as: 'rols',
                include: [{
                    model: permission,
                    as: 'permissions',
                    include: [
                        {
                            model: resource,
                            as: 'resources'
                        },
                        {
                            model: action,
                            as: 'actions'
                        }
    
                    ]
                }]
            }]
        }]
    });    
 
    const actions_name = new Array()
    let resources_name = new Array()
    result.user_types[0].rols.permissions.forEach(element => {

        console.log(element.resources.module_name+'--'+element.actions.name);
        actions_name.push(element.actions.name);
        resources_name.push(element.resources.module_name);
    });
     
    const name_action = req.method
    const name_module = (req.url).split("/")
    console.log(typeof(resources_name))
    console.log(name_module[2]+'---'+name_action)
 
    if ( !(resources_name.includes(name_module[2]) && actions_name.includes(name_action)) ) {
        console.log('paso1')
        return url==req.baseUrl            
    }
    else{
        console.log('paso2')
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