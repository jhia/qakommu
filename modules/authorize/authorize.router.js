'use strict'

const router = require('express').Router();
const authorizeController = require('./authorize.controller');


/**
 * Generate access token
 * refreshToken required
 */
router.post('/', (req, res) => authorizeController.createAccessToken(req, res));

/**
 * Remove refresh token
 * refreshToken required
 */
router.post('/reject', (req, res) => authorizeController.removeRefreshToken(req, res));


module.exports = router;