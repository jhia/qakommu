'use strict'

const Base = require('../../helpers/base.controller');
const { Response, ResponseError } = require('../../http');

const controller = new Base('authorize');

controller.createAccessToken = async function (req, res) {
  const refreshToken = req.headers.Authentication || req.headers.authentication;
  const response = new Response(res);

  if (!refreshToken) {
    let validationError = new ResponseError(400, 'No authentication provided')
    return response.send(validationError);
  }

  try {
    const authentication = await this.model.findOne({
      where: {
        refreshToken
      }
    })

    if (!authentication) {
      let authenticationError = new ResponseError(401, 'Authentication not valid')
      return response.send(authenticationError)
    }

    const user = await this.db.user.findOne({ where: { id: authentication.userId } })

    return response.send(authentication.generateAccessToken(req.app.get('secret')))

  } catch ({ message }) {
    console.log(message)
    let connectionError = new ResponseError(403, 'Try again later');
    return response.send(connectionError);
  }
}


controller.removeRefreshToken = async function (req, res) {
  const refreshToken = req.headers.Authentication;
  const response = new Response(res);

  if (!refreshToken || typeof refreshToken !== '') {
    let validationError = new ResponseError(400, 'No authentication provided')
    return response.send(validationError);
  }

  try {
    const authentication = await this.model.findOne({
      where: {
        refreshToken
      }
    })

    if (!authentication) {
      let authenticationError = new ResponseError(401, 'Authentication not valid')
      return response.send(authenticationError)
    }

    await this.delete(authentication)
    return response.send()

  } catch ({ message }) {
    let connectionError = new ResponseError(403, 'Try again later');
    return response.send(connectionError);
  }
}


module.exports = controller;