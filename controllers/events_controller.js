const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { Events } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class events_controller extends base {
    initProperties() {
        this.model = Events;
        this.response_fields = [
            'id',
            'title',
            'is_draft',
            'location',
            'description',
            'communityId',
            'online',
            'start',
            'end',
            'active',
            'formId',
            'prom_rate',
            'repositoryId',
            'createdAt',
            'updatedAt',
        ];

        this.fillables = [
            'title',
            'is_draft',
            'location',
            'description',
            'communityId',
            'online',
            'start',
            'end',
            'active',
            'formId',
            'prom_rate',
            'repositoryId',
            'createdAt',
            'updatedAt',
        ];
        this.relations = [];

        this.search_fields = {
            "title": {
                whereTo: "master",
                real_name: "title"
            },
            "is_draft": {
                whereTo: "master",
                real_name: "is_draft"
            },
            "description": {
                whereTo: "master",
                real_name: "description"
            }
        };

        this.pk = 'id';
        this.not_found_message = 'Events with id <%= record %> Not Found!';
        this.module_name = 'events';
        this.validate_permissions = false;
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

module.exports = events_controller;
