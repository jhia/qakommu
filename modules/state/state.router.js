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

router.get('/:id',function(req, res){
  //HTTP get route
  stateController.getFunc(req,res);
});

router.get('/module/:id',function(req, res){
  //HTTP get route
  stateController.getDataByModuleName(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  stateController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  stateController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  stateController.deleteFunc(req,res);
});

module.exports = router;