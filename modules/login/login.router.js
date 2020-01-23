'use strict'

const router = require('express').Router();
const loginController = require('./login.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  loginController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  loginController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  loginController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  loginController.deleteFunc(req,res);
});

module.exports = router;