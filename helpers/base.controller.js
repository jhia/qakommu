'use strict';

const db = require('../models')

function base(name) {
	//controller constructor
	this.db = db;
	this.moduleName = name;

	if (this.db.hasOwnProperty(name) && !!this.db[name]) {
		this.model = this.db[this.moduleName];
	}
}

base.prototype.getFunc = function (req, res) {
	this.response({
		res,
		message: 'Everything is ok!'
	});
}

base.prototype.postFunc = async function (req, res) {
	const id = await this.insert(req.body);
	if (id) {
		this.response({
			res,
			payload: [id]
		})
	}
}

base.prototype.putFunc = async function (req, res) {
	const id = await this.update(req.body);
	if (id) {
		this.response({
			res,
			payload: [id]
		})
	}
}

base.prototype.deleteFunc = function (req, res) {
	res.status('200').send(`GET to ${this.moduleName}`);
}

base.prototype.update = async function (data) {
	const { id } = data;
	if (!id) throw new Error("id is needed");

	const fillables = Object.keys(data.data);
	const result = await this.model.update(data.data,
		{
			fields: fillables,
			where: {
				id
			}
		});
	if (!result[0]) {
		throw new Error("I cannot perform the action successfully");
	};

	if (data.return_data) {
		return data.data;
	};
	return true;
}

base.prototype.insert = async function (data) {
	const res = await this.db[this.moduleName].create(data, {
		retuning: true,
		fields: Object.keys(cleanData)
	});
	return res;
}

base.prototype.getData = async function (data) {
	const { id, limit, offset, order, attributes, modelstoextended } = data;
	
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


base.prototype.delete = async function (data) {
	const { id } = data;
	const row = await this.model.destroy({
		where: {
			id
		}
	});
	return row;
}

module.exports = base;
