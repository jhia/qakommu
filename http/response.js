'use strict';

const ResponseError = require('./error');

/**
 * Node.js prebuilt HTTP Status code and messages
 * @external {http.STATUS_CODES} https://nodejs.org/docs/latest-v10.x/api/http.html#http_http_status_codes
 */
const STATUS = require('http').STATUS_CODES;

/**
 * Response
 * @access public
 * @desc HTTP response class
 * @example
 * let response = new Response(res)
 * response.json(data)  // good response
 * let registerError = new ResponseError(400)
 * registerError.addContext('name', 'Not a valid name')
 * registerError.addContext('email', 'Not a valid email')
 * response.json(registerError)  // bad response
 */

class Response {

  /**
   * @param {Express.Response} res Express response provided by route function
   */
  constructor(res) {
    /**
     * @ignore
     */
    this._res = res;
    /**
     * @type {number}
     */
    this.statusCode = 200;
  }

  /**
   * @return {boolean} is a successful response
   */
  get successful() {
    return [200, 201].includes(this.statusCode);
  }

  /**
   * @param {Object|Array} data payload to send in response, is optional
   * @return {Express.Response}
   */
  send(data = null) {
    if(!data) { // no data, relies on status code
      return this._res
      .statusCode(this.statusCode)
      .end({
        successful: this.successful,
        message: STATUS[this.statusCode]
      });
    }

    if(data instanceof ResponseError) { // error message
      this.statusCode = data.statusCode;
      return this._res.status(data.statusCode)
        .json({
          successful: false,
          message: data.message,
          payload: data.payload
        });
    }
    
    // default 
    this._res.status(this.statusCode)
      .json({
        successful: this.successful,
        message: STATUS[this.statusCode],
        payload: data
      });
  }

  /**
   * Create a new response
   * @param {*} res from HTTP/Express response
   */
  static from(res) {
    return new Response(res);
  }
}

module.exports = Response;