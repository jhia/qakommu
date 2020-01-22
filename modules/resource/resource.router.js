'use strict'

const router = require('express').Router();
const resourceController = require('./resource.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  resourceController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  resourceController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  resourceController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  resourceController.deleteFunc(req,res);
});

module.exports = router;