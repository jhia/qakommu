const base = require('./base');
const db = require('../models');
const { resources, permissions } = db;
const sequelize = require('sequelize');
const { Op } = sequelize;
const _ = require('lodash');

class resources_controller extends base {

    initProperties() {
        this.model = resources;
        this.response_fields = [
            'id',
            'module_name',
            'action',
            'created_at',
            'updated_at',
        ];

        this.pk = 'id';
        this.module_name = 'resources';
        this.validate_permissions = true;
        this.not_found_message = 'Resource Not Found <%= record %>!';

        this.relations = [
            {
                model: permissions,
                as: 'permissions'
            }
        ];

        this.search_fields = {
            "description": {
                whereTo: "master",
                real_name: "description"
            },
            "module_name": {
                whereTo: "master",
                real_name: "module_name"
            },
            "permission.description": {
                whereTo: "relation",
                relation: permissions,
                real_name: "description"
            },
        };

    }

    async getMany(){
        this.listMany();
    }

    async getOne(){
        this.listOne();
    }
}

module.exports = resources_controller;