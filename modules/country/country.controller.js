'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const Response = require('../../http/response');
const ResponseError = require('../../http/error');

const controller = new Base('country');

/**
 * get all countries
 */
controller.getFunc = function (req, res) {
  const response = new Response(res)
  console.log(this.model())
  this.getData({})
  .then(countries => {
    response.send(countries)
  })
  .catch(err => {
    console.warn(err);
    response.send(new ResponseError(402));
  })
}

module.exports = controller;