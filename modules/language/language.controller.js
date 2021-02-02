'use strict'

const Base = require('../../helpers/base.controller');
const ResponseError = require('../../http/error');

const controller = new Base('language');

/**
 * Get all available languages
 * @param {express.Request} req 
 * @param {Response} res 
 */
controller.getFunc = async function (req, res) {
  try {
    const languages = await this.model.findAll({});
    return res.send(languages);
  } catch ({ message }) {
    //connection error
    process.stderr.write(message);
    const langError = new ResponseError(503, "Try again later");
    return res.send(langError);
  }
}

module.exports = controller;