'use strict'

const router = require('express').Router();
const stateController = require('./state.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  stateController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  stateController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  stateController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  stateController.deleteFunc(req,res);
});

module.exports = router;