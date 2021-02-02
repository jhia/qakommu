'use strict'

const Base = require('../../helpers/base.controller');
const ResponseError = require('../../http/error');

const controller = new Base('membership');

/**
 * Get all memberships
 * @param {Express.Request} req 
 * @param {Response} res 
 */
controller.getFunc = function (req, res) {
  this.getData({})
  .then(memberships => {
    res.send(memberships);
  })
  .catch(err => { // connection error
    res.send(new ResponseError(402, "Try again later"))
  })
}

module.exports = controller;