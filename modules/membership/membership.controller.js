'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const Response = require('../../http/response');
const ResponseError = require('../../http/error');

const controller = new Base('membership');

/**
 * Get all memberships
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
controller.getFunc = function (req, res) {
  const response = new Response(res)

  this.getData({})
  .then(memberships => {
    response.send(memberships);
  })
  .catch(err => { // connection error
    response.send(new ResponseError(402, "Try again later"))
  })
}

module.exports = controller;