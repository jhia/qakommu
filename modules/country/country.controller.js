'use strict'

const Base = require('../../helpers/base.controller');
const Response = require('../../http/response');
const ResponseError = require('../../http/error');

const controller = new Base('country');

/**
 * get all countries
 */
controller.getFunc = async function (req, res) {
  const response = new Response(res);
  try {
    const countries = await this.model.findAll({});
    return response.send(countries);
  } catch ({ message }) {
    //connection error
    process.stderr.write(message);
    const err = new ResponseError(403, "Error loading countries");
    return response.send(err);
  }
}

module.exports = controller;