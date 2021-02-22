'use strict'

const Base = require('../../helpers/base.controller');
const { ResponseError } = require('../../http');

const controller = new Base('authorize');

controller.createAccessToken = async function (req, res) {
  const refreshToken = req.cookies.Authentication || req.cookies.authentication;

  if (!refreshToken) {
    let validationError = new ResponseError(400, 'No authentication provided')
    return res.send(validationError);
  }

  try {
    const authentication = await this.model.findOne({
      where: {
        refreshToken
      }
    })

    if (!authentication) {
      let authenticationError = new ResponseError(401, 'Authentication not valid')
      return res.send(authenticationError)
    }

    const user = await this.db.user.findOne({ where: { id: authentication.userId } })

    return res.send(authentication.generateAccessToken(req.app.get('secret')))

  } catch ({ message }) {
    console.log(message)
    let connectionError = new ResponseError(503, 'Try again later');
    return res.send(connectionError);
  }
}


controller.removeRefreshToken = async function (req, res) {
  const refreshToken = req.headers.Authentication;

  if (!refreshToken || typeof refreshToken !== '') {
    let validationError = new ResponseError(400, 'No authentication provided')
    return res.send(validationError);
  }

  try {
    const authentication = await this.model.findOne({
      where: {
        refreshToken
      }
    })

    if (!authentication) {
      let authenticationError = new ResponseError(401, 'Authentication not valid')
      return res.send(authenticationError)
    }

    await this.delete(authentication)
    return res.send()

  } catch ({ message }) {
    let connectionError = new ResponseError(503, 'Try again later');
    return res.send(connectionError);
  }
}


module.exports = controller;