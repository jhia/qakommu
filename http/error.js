'use strict';

/**
 * Node.js prebuilt HTTP Status code and messages
 * @external {http.STATUS_CODES} https://nodejs.org/docs/latest-v10.x/api/http.html#http_http_status_codes
 */
const STATUS = require('http').STATUS_CODES;

/**
 * Create an error for Response class
 * @extends Error
 * 
 * @example
 * let response = new Response(res)
 * let emailError = new ResponseError(401, "Not a valid email")
 * response.json(emailError)
 */

class ResponseError extends Error {
  /**
   * @param {number} statusCode HTTP status code
   * @param {number} message custom message
   */
  constructor(statusCode, message=null) {
    super(message || STATUS[statusCode]);
    /**
     * @type {number}
     */
    this.statusCode = statusCode;
    /**
     * @type {object}
     */
    this.payload = {};
  }

  /**
   * @method addContext add context to error
   * @param {string} name identifier
   * @param {string} message description
   */
  addContext(name, message) {
    this.payload[name] = message;
  }

  /**
   * @method removeContext remove context from error
   * @param {string} name identifier 
   */
  removeContext(name) {
    delete(this.payload[name]);
  }

}

module.exports = ResponseError;