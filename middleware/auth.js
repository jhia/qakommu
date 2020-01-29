const jwt = require('jsonwebtoken');
const _ = require('lodash');
const db = require('../models');

const {user,user_type,role,permission,resource} = db

const permissionsVerification = async function (req, res, next){
// para saltarse el auth
if (req.headers.skip) {
    next();
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


//console.log(result.user_types[0].roles.permissions[0])
//console.log(result.user_types[0].roles.permissions[0]._delete)

function validate(){

    const { _create, _read, _update, _delete } = result.user_types[0].roles.permissions[0]


    switch (name_action.toUpperCase()) {
        case 'POST':
            console.log('paso1')
            return _create;
            break;
    
        case 'GET':
                console.log('paso2')
                return _read;
            break;
   
        case 'READ':
                console.log('paso3')
                return _update;
            break;

        case 'DELETE':
                console.log('paso4')
                return _delete;
            break;
                 


    }

}

    if (!validate()) {

        console("---------------")
        console(req.baseUrl)
        console("---------------")
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