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

base.prototype.posFunc = async function(req,res){
    console.log('--------------')
    console.log(req.body)
    console.log('--------------')

	const id = await this.insert(req.body);
	if (id) {
		res.status(200).send(id)
	}
}

base.prototype.putFunc = function(req,res){
	
	//res.status('200').send(`PUT to ${this.moduleName}`);
}

base.prototype.deleteFunc = function(req,res){
	res.status('200').send(`GET to ${this.moduleName}`);
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