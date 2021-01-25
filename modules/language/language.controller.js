'use strict'

const Base = require('../../helpers/base.controller');
const ResponseError = require('../../http/error');
const Response = require('../../http/response');

const controller = new Base('language');

/**
 * Get all available languages
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
controller.getFunc = async function (req, res) {
  const response = new Response(res);
  try {
    const languages = await this.model.findAll({});
    return response.send(languages);
  } catch (err) {
    //connection error
    process.stderr.write(message);
    const langError = new ResponseError(403, "Error loading languages");
    return response.send(langError);
  }
}

module.exports = controller;