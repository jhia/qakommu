'use strict'

const router = require('express').Router();
const communityController = require('./community.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  communityController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  communityController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  communityController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  communityController.deleteFunc(req,res);
});

module.exports = router;