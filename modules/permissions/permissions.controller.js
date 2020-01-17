const base = require('../../base');
const db = require('../../models');
const { Permissions } = db;
const _ = require('lodash');

class permission extends base {

    initProperties() {
        this.model = Permissions;
        
        this.response_fields = [
            'description'
        ];

        this.fillables = [
            'description'
        ];


        this.pk = 'id';
        this.not_found_message = 'Permission with id <%= record %> Not Found!';
        this.module_name = 'permissions';
        this.validate_permissions = false;
        //this.validate_permissions = true;
        //this._validate_fields = ['description', 'resource_id'];

        //this._validate_fields = ['description'];
        //this._messages = ['This Description Exists for another permission'];




        this.search_fields = {
            "description": {
                whereTo: "master",
                real_name: "description"
            }
            

        };

    }

    async getMany(){
        this.listMany();
    }

    async getOne(){
        this.listOne();
    }





    async post(){
//        if (this.existsResource()) {
            console.log('------------------------')
            this.create(false, this._validate_fields, this._messages);
            //this.create();

            
            //this.create();
//        }
    }

    async put(){
//        if (this.existsResource()){
            this.update(false, this._validate_fields, this._messages);
//        }
    }

    async delete(){
        this.destroy();
    }




}

module.exports = permission;