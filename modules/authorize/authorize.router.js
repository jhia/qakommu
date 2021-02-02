'use strict'

const router = require('express').Router();
const authorizeController = require('./authorize.controller');
const Response = require('../../http/response')

/**
 * Generate access token
 * refreshToken required
 */
router.post('/', (req, res) => {
  authorizeController.createAccessToken(req, new Response(res));
});

/**
 * Remove refresh token
 * refreshToken required
 */
router.post('/reject', (req, res) => {
  authorizeController.removeRefreshToken(req, new Response(res))
});


module.exports = router;