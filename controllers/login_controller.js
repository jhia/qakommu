const base = require('./base');
const db = require('../models');
const { Users, Roles, Permissions, Resources } = db;
const keys = require('../config/keys');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

class login_controller extends base {

    initProperties() {
        this.forbidden_message = 'unauthorized <%= record %>!';
    }

    async post() {
        const email = this.req.body.email || '';
        const user = await Users.findOne({
            where: {
                email,
                active: true
            },
            include:[{
                model: Roles,
                attributes: ['id'],
                through: { attributes:[] },
                include: [{
                    model: Permissions,
                    include: [{
                        model: Resources,
                        as: 'resource'
                    }]
                }]
            }]
        });

        if (!user) {
            this.res.status(404).json({
                message: 'User Not Found'
            })
        } else {
            const { password }  = this.req.body;
            const hash = await bcrypt.compare(password, user.password);
            if(!hash){
                return this.respondUnauthorized(email)
            }

            let User = {
                email,
                resources: this.getResourcesForUser(user),
            };

            User.token = jwt.sign(User, keys.secret, {
                expiresIn: '1y',
                algorithm: 'HS512',
            });

            return this.res.status(200).send({
                response: User.token
            });
        }
    }

    respondUnauthorized(id){
        const compiled = _.template(this.forbidden_message);
        const message = compiled({ 'record': id });
        this.res.status(401).json({
            message
        });
    }

    getResourcesForUser(user) {
        const { roles } = user;

        if (roles) {
            const resources = roles.map((rol) => {
                const { permissions } = rol;
                return permissions.map((permission) => {
                    try {
                        const { module_name, action } = permission.resource.dataValues;
                        return `${module_name}.${action}`;
                    } catch (e) {
                        return false;
                    }
                });
            });
            return resources[0];
        }

        return [];
    }
}

module.exports = login_controller;