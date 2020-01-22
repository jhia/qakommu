'use strict'

const router = require('express').Router();
const rolesController = require('./roles.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  rolesController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  rolesController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  rolesController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  rolesController.deleteFunc(req,res);
});

module.exports = router;