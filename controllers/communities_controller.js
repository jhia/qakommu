const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { Communities } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class communities_controller extends base {
    initProperties() {a
        this.model = Communities;
        this.response_fields = [
            'id',
            'name',
            'description',
            'web',
            'prefix',
            'member_verification',
            'repositoryId',
            'createdAt',
            'updatedAt',
        ];

        this.fillables = [
            'name',
            'description',
            'web',
            'prefix',
            'member_verification',
            'repositoryId',
            'createdAt',
            'updatedAt',
        ];
        this.relations = [];

        this.pk = 'id';
        this.not_found_message = 'Community with id <%= record %> Not Found!';
        this.module_name = 'communities';
        this.validate_permissions = true;
    }

    async getMany(){
        this.listMany();
    }

    async getOne(){
        this.listOne();
    }

    async post() {
        this.create();
    }

    async put(){
        this.update();
    }

    async delete(){
        this.destroy();
    }
}

module.exports = communities_controller;
