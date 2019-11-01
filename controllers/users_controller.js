const base = require('./base');
const db = require('../models');
const sequelize = require('sequelize');
const { Users, Roles } = db;
const { Op } = sequelize;
const _ = require('lodash');

class users_controller extends base {

    initProperties() {
        this.model = Users;
        this.response_fields = [
            'name',
            'last_name',
            'email',
            'gender',
            'repositoryId',
            'last_login',
            'active',
            'createdAt',
            'updatedAt',
        ];

        this.fillables = [];

        this.relations = [
            {
                model: Roles,
                as: 'roles',
                through: {attributes: []}
                // include:[{
                //     model: permissions,
                //     as: 'permissions',
                // }]
            }
        ];

        this.pk = 'id';
        this.not_found_message = 'Users with id <%= record %> Not Found!';
        this.validate_permissions = true;
        this.module_name = 'users';
    }

    async getMany(){
        this.listMany();
    }

     async getOne(){
        this.listOne();
    }

    async post(){
        const email = this.req.body.email || null;

        const user_created = await this.create(true, ['email'], [`the email [${email}] already for a user`]);
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

    async put(){
        const email = this.req.body.email || null;
        const id = this.req.params[this.pk];
        const user_updated = await this.update(true, ['email'], [`the email [${email}] already for a user`]);
        if (user_updated) {
            if (!_.isEmpty(this.req.body.roles)) {
                user_updated.setRoles(this.req.body.roles || []);
            }

            this.res.status(200).json({
                pk: id
            });
        }
    }

    async delete(){
        this.destroy();
    }
}

module.exports = users_controller;