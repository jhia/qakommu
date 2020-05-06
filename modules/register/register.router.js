'use strict'

const router = require('express').Router();
const registerController = require('./register.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.post('/:comunity_code?/:invitation_code?',(req, res) => {
  ///HTTP post route
  registerController.postFunc(req,res);
});

module.exports = router;