'use strict'

const router = require('express').Router();
const loginController = require('./login.controller');
const Response = require('../../http/response');


router.post('/', (req, res) => loginController.signUpEmail(req, new Response(res)));

module.exports = router;