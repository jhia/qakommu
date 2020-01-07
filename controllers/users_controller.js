const base = require('./base');
const db = require('../models');
const { Users, Roles, Communities } = db;
const _ = require('lodash');

class users_controller extends base {
    initProperties() {
        this.model = Users;
        this.forbidden_message = 'unauthorized <%= record %>!';
        this.validate_permissions = false;

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
            'updatedAt'
        ];

        this.relations = [ 
            {
                model: Roles,
                as: 'roles',
                through: {attributes: []}
            },
            {
                model: Communities,
                as: 'communities',
                through: {attributes: []}
            }
        ];
        this.pk = 'id';
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
                user_created.addCommunities(this.req.body.communities || "");
            }
            //RESPONSE USER CREATED
            this.res.status(201).json({
                pk: user_created[this.pk]
            });
        }
    }


    async put() {
        const email = this.req.body.email || null;
        const default_rol = await Roles.findOne({
            where:{
                default: true
            },
            attributes: ['id']
        });
        console.log("-----"+(!_.isEmpty(this.req.body.roles) || default_rol.id)+"-----")        
        const user_updated = await this.update(true, ['email'], [`the email [${email}] already exists for a user`]);
        console.log("----"+user_updated+"----")
        if (user_updated) {
            if (!_.isEmpty(this.req.body.roles) || default_rol.id) {
                console.log("------paso-----")
                user_updated.addRoles(this.req.body.roles);
                user_updated.addCommunities(this.req.body.communities);
            }
            //RESPONSE USER CREATED
            this.res.status(201).json({
                pk: user_updated[this.pk]
            });
        }
    }
    





    async delete(){
        this.destroy();
    }
}

module.exports = users_controller;