const base = require('./base');
const db = require('../models');
// const sequelize = require('sequelize');
const { Themes } = db;
// const { Op } = sequelize;
const _ = require('lodash');

class themes_controller extends base {

    initProperties() {
        this.model = Themes;
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
        this.module_name = 'themes';
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

module.exports = themes_controller;