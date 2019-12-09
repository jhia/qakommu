const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { forms } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class forms_controller extends base {

    initProperties() {
        this.model = forms;
        this.response_fields = [
            'name',
            'description',
        ];

        this.fillables = [
            'name',
            'description',
        ];

        this.relations =  [
        ];

        this.pk = 'id';
        this.not_found_message = 'forms with id <%= record %> Not Found!';
        this.module_name = 'forms';
        this.validate_fields = [];
        this._messages = [];

        this.search_fields = {
            "description": {
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

module.exports = forms_controller;
