'use strict'

const Base = require('../../helpers/base.controller');
const controller = new Base('state');

const db = require('../../models');
const { state } = db;


controller.postFunc = async function (req, res) {
	//get body 
	const{ name, description, active, bloker} = req.body;
	try {
        let newState = await this.model.create({
            name,
            description,
            active,
            module_name: this.moduleName,
            bloker
        }, {
            fields: ['name', 'description', 'active', 'module_name' ,'bloker']
		});
		//console.log(newState);
        if(newState){
             res.json({
                message: 'successful action',
                date: newState
            });
		}
    } catch (error) {
        res.status(500).json({
            message: 'something went wrong',
            date: {}
        });  
    }
	//Overwrite the base post function

	/*
	console.log(name);
	console.log(description);
	console.log(active);
	console.log(module_name);
	console.log(bloker);
	console.log("punto2");
	console.log(this.moduleName);
	console.log("punto3");
	
	console.log(req.body);
	console.log("punto4");
	console.log();
	*/
	//return `POST mariquito to ${this.moduleName} overwritten`;
}

module.exports = controller;