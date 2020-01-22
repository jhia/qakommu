'use strict'

const router = require('express').Router();
const actionsController = require('./actions.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  actionsController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  actionsController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  actionsController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  actionsController.deleteFunc(req,res);
});

module.exports = router;