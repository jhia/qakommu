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

        this.pk = 'id';
        this.not_found_message = 'Community with id <%= record %> Not Found!';
        this.module_name = 'events';
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

module.exports = events_controller;