'use strict';

const db = require('../models')
const Response = require('../http/response');

function base(name) {
	//controller constructor
	this.db = db;
	this.moduleName = name;

	if (this.db.hasOwnProperty(name) && !!this.db[name]) {
		this.model = this.db[this.moduleName];
	}
}

base.prototype.getFunc = function (req, res) {
	Response.from(res).send();
}
/* DO NOT CREATE CRUD AUTOMATICALLY
base.prototype.postFunc = async function (req, res) {
	const id = await this.insert(req.body);
	if (id) {
		Response.from(res).send([id]);
	}
}

base.prototype.putFunc = async function (req, res) {
	const id = await this.update(req.body);
	if (id) {
		Response.from(res).send([id])
	}
}

base.prototype.deleteFunc = function (req, res) {
	res.status('200').send(`GET to ${this.moduleName}`);
}*/

base.prototype.update = async function (data) {
	const { id } = data;
	if (!id) throw new Error("id is needed");

	const fillables = Object.keys(data.data);

	const result = await this.model.update(data.data,
		{
			fields: fillables,
			where: {
				id
			},
			returning: true
		}
	);
	if (!result[0]) {
		throw new Error("I cannot perform the action successfully");
	};

	if (data.returning) {
		let r = {};
		for(const key of data.returning) {
			r[key] = result[1][0][key];
		}
		return r;
	}
	return true;
}

base.prototype.insert = async function (data, options = {}) {
	let fields = Object.keys(data);
	const res = await this.db[this.moduleName].create(data, {
		returning: options.returning,
		fields
	});

	if (options.returning) {
		let r = {};
		for(const key of options.returning) {
			r[key] = res[key];
		}
		return r;
	}
	return res.id;
}

base.prototype.getData = async function (data) {
	const { id, limit, offset, order, attributes, where } = data;

	if (id) {
		const one = await this.model.findByPk(id, {
			attributes
		});
		return one;
	} else {
		const list = await this.model.findAll({
			limit,
			offset,
			attributes,
			order,
			where
		});
		return list;
	}
}


base.prototype.delete = async function (id) {
	const row = await this.model.destroy({
		where: {
			id
		}
	});
	return row;
}

module.exports = base;
