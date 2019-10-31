const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { permissions, resources } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class permissions_controller extends base {

    initProperties() {
        this.model = permissions;
        this.response_fields = [
            'description',
            'resource_id',
        ];

        this.fillables = [
            'description',
            'resource_id'
        ];

        this.relations =  [
            {
                model: resources,
                as:'resource'
            }
        ];

        this.pk = 'id';
        this.not_found_message = 'Permission with id <%= record %> Not Found!';
        this.module_name = 'permissions';
        this.validate_permissions = true;
        this._validate_fields = ['description', 'resource_id'];
        this._messages = ['This Description Exists for another permission', 'This Resource is used on another Permission'];

        this.search_fields = {
            "description": {
                whereTo: "master",
                real_name: "description"
            },
            "resource_id": {
                whereTo: "master",
                real_name: "resource_id"
            },
            "resource.description": {
                whereTo: "relation",
                relation: resources,
                real_name: "description"
            },
            "resource.action": {
                whereTo: "relation",
                relation: resources,
                real_name: "action"
            },
        };

    }

    async getMany(){
        this.listMany();
    }

    async getOne(){
        this.listOne();
    }

    async existsResource() {
        const {resource_id} = this.req.body;
        const exist = await this.validateResourceId(resource_id);

        if (!exist) {
            this.res.status(409).json({
                message: `the resource with id ${resource_id} not exists`
            });
        }
        return exist;
    }

    async post(){
        if (this.existsResource()) {
            this.create(false, this._validate_fields, this._messages);
        }
    }

    async put(){
        if (this.existsResource()){
            this.update(false, this._validate_fields, this._messages);
        }
    }

    async delete(){
        this.destroy();
    }

    validateResourceId(resource_id){
        return resources.count({
            where: {
                id: resource_id
            }
        });
    }
}

module.exports = permissions_controller;