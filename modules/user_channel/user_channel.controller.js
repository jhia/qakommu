'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('user_channel');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

module.exports = controller;