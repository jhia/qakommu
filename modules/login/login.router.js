'use strict'

const router = require('express').Router();
const loginController = require('./login.controller');

router.post('/', loginController.signUpEmail);

module.exports = router;