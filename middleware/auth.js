const jwt = require('jsonwebtoken');
const _ = require('lodash');
const db = require('../models');
//const { Roles, Permissions, Resources, Users } = db;

/* 
async function permissionsVerification(req, res, decoded, module_name, action) {
    let user = false;
    if (!_.isEmpty(decoded.email) && !_.isEmpty(module_name) && !_.isEmpty(action) ) {
        const field_id = ['id'];
        user = await Users.findOne({
            where: {
                email: decoded.email
            },
            attributes: field_id,
            include:[{
                model: Roles,
                as: 'roles',
                required: true,
                duplicating: true,
                attributes: field_id,
                through: {attributes: []},
                include: [{
                    model: Permissions,
                    as: 'permissions',
                    required:true,
                    duplicating: true,
                    attributes: field_id,
                    through: {attributes: []},
                    include: [{
                        model: Resources,
                        as:'resource',
                        attributes: field_id,
                        duplicating: true,
                        where: {
                            module_name,
                            action
                        }
                    }]
                }]
            }]
        });
    }

    req.user = user;
    if (!user) {
        res.status(403).send({
            message:"This user cannot access to this resource"
        });
    }

    return !!user;
}
 */


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        //req.verificatePermisssion = permissionsVerification.bind(this, req, res, decoded);//pendiente
        console.log("--------------"+decoded.email+"--------------")
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};