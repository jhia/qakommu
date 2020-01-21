'use strict';

const _ = require('lodash');

const db = require('../models')

function base(name){
	//controller constructor
	this.db = db;	
	this.moduleName = name;
	this.model = this.db[this.moduleName]
}

base.prototype.getFunc = async function(req,res){
	await this.model.findAll().then((result) => res.json(result))
	res.status('200').send(`GET to ${this.moduleName}`);
}

base.prototype.postFunc = async function(req,res){
	const id = await this.insert(req.body);
	if (id) {
		res.status(200).send(id)
	}
}

base.prototype.putFunc = async function(req,res){
	const id = await this.update(req)
	if (id) {
		res.status(200).send('updated')
	}
}

base.prototype.deleteFunc = function(req,res){
	res.status('200').send(`GET to ${this.moduleName}`);
}

base.prototype.update = async function(req){
	const {id} = req.params;
	const fillables = _.keys(req.body) 		
	const result = await this.model.update(req.body, {
        where: {
            id
		},
		fields: fillables
	});
	return result
}



base.prototype.insert = async function(data){
	const fillables = _.keys(data) 	
 	const res = await this.db[this.moduleName].create(data, {
		retuning:true,
		fields: fillables
	});
	return res;
}

module.exports = base;