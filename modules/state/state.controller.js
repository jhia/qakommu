'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('state');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/


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
		
        if(newState){
             res.status(200).json({
                message: 'successful action',
                date: newState
            });
		}
		
    } catch (error) {
        console.log(error);
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