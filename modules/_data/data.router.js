'use strict'

const router = require('express').Router();
const dataController = require('./data.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  dataController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  dataController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  dataController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  dataController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  dataController.deleteFunc(req,res);
});

module.exports = router;