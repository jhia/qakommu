'use strict'

const router = require('express').Router();
const rolController = require('./rol.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  rolController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  rolController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  rolController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  rolController.deleteFunc(req,res);
});

module.exports = router;