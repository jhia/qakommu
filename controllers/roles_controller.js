const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { roles, permissions, resources } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class roles_controller extends base {

    initProperties() {
        this.model = roles;
        this.response_fields = [
            'id',
            'description',
        ];

        this.fillables = [
            'description'
        ];
        this.relations = [];

        this.pk = 'id';
        this.not_found_message = 'Rol with id <%= record %> Not Found!';
        this.module_name = 'roles';
        this.validate_permissions = true;

        this.search_fields = {
            "description": {
                whereTo: "master",
                real_name: "description"
            },
            "resources.module_name": {
                whereTo: "relation",
                relation: resources,
                real_name: "module_name"
            },
            "permissions.description": {
                whereTo: "relation",
                relation: permissions,
                real_name: "description"
            },
        };

        this.relations = [{
            model: permissions,
            as: 'permissions',
            through: { attributes: [] },
            include: [{
                model: resources,
                as:'resource'
            }]
        }];
    }

    async getMany(){
        this.listMany();
    }

    async getOne(){
        this.listOne();
    }

    async post() {
        const rol_created = await this.create(true  ,['description'], ['this description exists']);
        if (rol_created) {
            if (!_.isEmpty(this.req.body.permissions)) {
                rol_created.addPermissions(this.req.body.permissions || []);
            }

            this.res.status(201).json({
                pk: rol_created[this.pk]
            });
        }
    }

    async put(){
        const rol_updated = await this.update(true,['description'], ['this description exists']);
        if (rol_updated) {
            if (!_.isEmpty(this.req.body.permissions)) {
                rol_updated.setPermissions(this.req.body.permissions || []);
            }

            this.res.status(200).json({
                pk: rol_updated[this.pk]
            });
        }
    }

    async delete(){
        this.destroy();
    }
}

module.exports = roles_controller;