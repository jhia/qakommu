'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('resources');

controller.getFunc = async function (req,res) {
	const query = await this.model.findAll({
	})	
	res.json({
		data: query
	})
}

/* 
controller.putFunc = async function (req,res) {
	const {id} = req.params;
	const fillables = _.keys(req.body) 	
	const result = await this.model.update(req.body, {
        where: {
            id
		},
		fields: fillables
	});
	if (result) {
		res.json({
			message: 'updated'
		});			
	}
}
 */

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