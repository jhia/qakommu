'use strict'

const router = require('express').Router();
const actionController = require('./action.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  actionController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  actionController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  actionController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  actionController.deleteFunc(req,res);
});

module.exports = router;