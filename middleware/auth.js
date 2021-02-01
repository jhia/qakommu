const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { user: User } = require('../models');
const { Response, ResponseError } = require('../http');

/**
 * First Middleware: verification
 * If this is a valid token
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {function} next 
 */
const permissionsVerification = async function (req, res, next) {
    const authorizationError = new ResponseError(401);
    const response = Response.from(res);
    
    if ((req.url).split("/")[1] === "uploads") {
        return next();
    }

    if(/^\/(auth|authorize)/.test(req.url)) {
        return next();
    }

    // get endpoint from country or language api
    if (/^\/api\/(country|language)\/?/.test(req.url)) {
        return next();
    }

    if(/^\/api\/user\/?$/.test(req.url) && req.method === 'POST') {
        return next();
    }

    let bearer = req.headers.Authorization || req.headers.authorization;

    if(!bearer) {
        return response.send(authorizationError);
    }

    let token = bearer.split(' ')[1];

    if(!token) {
        return response.send(authorizationError);
    }

    try {
        const decoded = jwt.verify(token, req.app.get('secret'));

        let user = await User.findByPk(decoded.user, { attributes: ['id', 'email', 'username']})
        if(!user) {
            return response.send(authorizationError);
        }
        req.user = user;
        next();
    } catch {
        return response.send(authorizationError);
    }
}

module.exports = permissionsVerification;