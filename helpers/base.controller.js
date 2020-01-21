'use strict';

const _ = require('lodash');

const db = require('../models')

function base(name){
	//controller constructor
	this.moduleName = name;
	this.db = db;	
	this.model = this.db[this.moduleName]
}

base.prototype.getFunc = function(req,res){
	res.status('200').send(`GET to ${this.moduleName}`);
}

base.prototype.postFunc = async function(req,res){
	const id = await this.insert(req.body);
	if (id) {
		res.status(200).send(id)
	}
}

base.prototype.putFunc = function(req,res){
	res.status('200').send(`PUT to ${this.moduleName}`);
}

base.prototype.deleteFunc = function(req,res){
	res.status('200').send(`GET to ${this.moduleName}`);
}

base.prototype.insert = async function(data){
	const fillables = _.keys(data) 	
 	const res = await this.model.create(data, {
		retuning:true,
		fields: fillables
	});
	return res;
}

base.prototype.getData = async function(data){
	const { id, limit, offset, order, attributes} = data;
	if (id) {
		const one = await this.model.findOne({
			where: {
				id
			},
			attributes,
			order
		});
		 return one;
	} else {
		const list = await this.model.findAll({
			limit,
			offset,
			attributes,
			order
		});
		return list;
	}
}

base.prototype.delete = async function(data){
	const { id } = data;
	const row = await this.model.destroy({
		where: {
			id
		}
	});
	return row;
}

module.exports = base;