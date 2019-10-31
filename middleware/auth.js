const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const db = require('../models');
const { Roles, Permissions, Resources, Users } = db;
const Op = require('sequelize').Op;

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

function auth(req,res,next) {
    const token = req.headers['authorization'];

    if (token) {
        const [token_type, real_token] = token.split(' ');
        jwt.verify(_.trim(real_token), keys.secret, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    message: 'Invalid Token'
                });
            } else {
                req.verificatePermisssion = permissionsVerification.bind(this, req, res, decoded);
                next();
            }
        });
    } else {
        req.verificatePermisssion = permissionsVerification.bind(this, req, res, []);
        next();
    }
}

module.exports = auth;