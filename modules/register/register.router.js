'use strict'

const router = require('express').Router();
const registerController = require('./register.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.post('/:code_comunity?/:code_invitation?',(req, res) => {
  ///HTTP post route
  registerController.postFunc(req,res);
});

module.exports = router;