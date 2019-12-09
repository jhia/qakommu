const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { inputs } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class inputs_controller extends base {

    initProperties() {
        this.model = inputs;
        this.response_fields = [
            'label',
            'type',
            'placeholder',
        ];

        this.fillables = [
            'label',
            'type',
            'placeholder',
        ];

        this.relations = [];

        this.pk = 'id';
        this.not_found_message = 'inputs with id <%= record %> Not Found!';
        this.module_name = 'inputs';
        this.validate_fields = [];
        this._messages = [];

        this.search_fields = {
            "label": {
                whereTo: "master",
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

    async post(){
        this.create(false, this.validate_fields, this._messages);
    }

    async put(){
        this.update(false, this.validate_fields, this._messages);
    }

    async delete(){
        this.destroy();
    }
}

module.exports = inputs_controller;
