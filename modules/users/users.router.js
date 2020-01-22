'use strict'

const router = require('express').Router();
const usersController = require('./users.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  usersController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  usersController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  usersController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  usersController.deleteFunc(req,res);
});

module.exports = router;