'use strict'

const Base = require('../../helpers/base.controller');
const Response = require('../../http/response');
const ResponseError = require('../../http/error');

const controller = new Base('country');

/**
 * get all countries
 */
controller.getFunc = async function (req, res) {
  try {
    const countries = await this.model.findAll({});
    return res.send(countries);
  } catch {
    //connection error
    const err = new ResponseError(503, "Try again later");
    return res.send(err);
  }
}

module.exports = controller;