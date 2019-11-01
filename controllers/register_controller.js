const base = require('./base');
const db = require('../models');
const { Users } = db;
const keys = require('../config/keys');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

class register_controller extends base {

    initProperties() {
        this.model = Users;
        this.forbidden_message = 'unauthorized <%= record %>!';
        this.validate_permissions = false;

        this.fillables = [
            'name',
            'last_name',
            'password',
            'email',
            'active',
            'gender',
            'repositoryId',
            'last_login',
            'createdAt',
            'updatedAt',
        ];

        this.pk = 'id';
    }

    async post() {
        const email = this.req.body.email || null;
        const user_created = await this.create(true, ['email'], [`the email [${email}] already exists for a user`]);
        if (user_created) {
            if (!_.isEmpty(this.req.body.roles)) {
                user_created.addRoles(this.req.body.roles || []);
            }
            //RESPONSE USER CREATED
            this.res.status(201).json({
                pk: user_created[this.pk]
            });
        }
    }
}

module.exports = register_controller;