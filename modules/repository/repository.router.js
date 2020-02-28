'use strict'

const router = require('express').Router();
const repositoryController = require('./repository.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  repositoryController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  repositoryController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  repositoryController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  repositoryController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  repositoryController.deleteFunc(req,res);
});

module.exports = router;