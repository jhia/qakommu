'use strict'

const router = require('express').Router();
const membershipController = require('./membership.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  membershipController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  membershipController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  membershipController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  membershipController.deleteFunc(req,res);
});

module.exports = router;