'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const ResponseError = require('../../http/error');
const Response = require('../../http/response');

const controller = new Base('language');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

/**
 * Get all available languages
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
controller.getFunc = async function (req, res) {
  const response = new Response(res);
  try {
    const languages = await this.getData();
    return response.send(languages);
  } catch (err) {
    const langError = new ResponseError(402, "Error loading languages");
    return response.send(langError);
  }
  this.getData()
  .then(languages => {
    this.response({
      statusCode: 200,
      payload: languages
    })
  })
  .catch(err => {
    const langError = new ResponseError(402, "Try again later");
  })
}

module.exports = controller;