const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { inputs_data } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class inputs_data_controller extends base {

    initProperties() {
        this.model = inputs_data;
        this.response_fields = [
            'id',
            'inputId',
            'data',
        ];

        this.fillables = [
            'inputId',
            'data',
        ];

        this.relations = [];

        this.pk = 'id';
        this.not_found_message = 'Input Data with id <%= record %> Not Found!';
        this.module_name = 'inputs_data';
        this.validate_fields = [];
        this._messages = [];

        this.search_fields = {
            "data": {
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

module.exports = inputs_data_controller;
