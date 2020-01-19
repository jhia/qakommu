'use strict';

const _ = require('lodash');

function base(name){
	//controller constructor
	this.moduleName = name;
}

base.prototype.getFunc = function(){
	return `GET to ${this.moduleName}`;
}

base.prototype.postFunc = function(){
	return `POST to ${this.moduleName}`;
}

base.prototype.putFunc = function(){
	return `PUT to ${this.moduleName}`;
}

base.prototype.deleteFunc = function(){
	return `GET to ${this.moduleName}`;
}

module.exports = base;