'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('permissions');


controller.getFunc = async function (req,res) {
	const query = await this.model.findAll({
	})	
	res.json({
		data: query
	})
}

controller.putFunc = function (req,res) {
	//Overwrite the base post function
    //const fillables = _.keys(req.body) 	

    //const id = req.params
/* 
    console.log('--------------')
    console.log(req.body)
    console.log('--------------')
 */
/*     
 	resources.update(req.body, {
        where: {
            id : id
        }
    });
 */




	return `POST to ${this.moduleName} overwritten`;
}



/* controller.postFunc = function (req,res) {
	//Overwrite the base post function
	const fillables = _.keys(req.body) 	
 	resources.create(req.body, {
		retuning:true,
		fields: fillables
	});
	return `POST to ${this.moduleName} overwritten`;
}
 */

module.exports = controller;