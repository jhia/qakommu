'use strict'

const router = require('express').Router();
const resourcesController = require('./resources.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  resourcesController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  resourcesController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  resourcesController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  resourcesController.deleteFunc(req,res);
});

module.exports = router;