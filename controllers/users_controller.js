const base = require('./base');
const db = require('../models');
const sequelize = require('sequelize');
const { users, memberships, closet_items, media, roles } = db;
const { Op } = sequelize;
const _ = require('lodash');

class users_controller extends base {

    initProperties() {
        this.model = users;
        this.response_fields = [
            'id',
            'uuid',
            'addons',
            [sequelize.fn('trim', sequelize.col('firstname')), 'firstname'],
            [sequelize.fn('trim', sequelize.col('lastname')), 'lastname'],
            [sequelize.fn('trim', sequelize.col('email')), 'email'],
            'created_at',
            'phone_1',
            'phone_2',
            'membership_status',
            'subscribed_at',
            'login_at',
            'birthday',
            'active',
            'created_at',
            'updated_at',
            'body_type',
            'height',
            'weight',
            'bra_size',
            'dress_size',
            'pants_size',
            'bust',
            'waist',
            'hips',
            'default_size',
            'tags',
            'notes',
        ];

        this.fillables = [
            'firstname',
            'lastname',
            'phone_1',
            'phone_2',
            'birthday',
            'membership',
            'membership_promo_code_used',
            'membership_status',
            'subscribed_at',
            'body_type',
            'bra_size',
            'bust',
            'default_size',
            'dress_size',
            'height',
            'hips',
            'weight',
            'pants_size',
            'waist',
            'notes',
            'tags',
            'email',
            'password',
        ];

        this.validate_search_fields = true;
        this.search_fields = [
            'firstname',
            'lastname',
            'email',
            'created_at',
            'phone_1',
            'membership_status',
            'subscribed_at',
        ];

        this.pk = 'uuid';
        this.not_found_message = 'Users with id <%= record %> Not Found!';
        this.validate_permissions = false;
        this.module_name = 'users';
    }

    async getMany(){
        this.relations = [];
        this.listMany();
    }

     async getOne(){

        this.relations = [
             {
                 model: memberships,
                 as: 'membership_details',
                 required: false,
             },
             {
                 model: closet_items,
                 as: 'closet',
                 required: false,
                 limit: 1,
             },
             {
                 model: roles,
                 as: 'roles',
                 through: {attributes: []}
                 // include:[{
                 //     model: permissions,
                 //     as: 'permissions',
                 // }]
             }
        ];
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