'use strict'

const router = require('express').Router();
const object_typeController = require('./object_type.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  object_typeController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  object_typeController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  object_typeController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  object_typeController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  object_typeController.deleteFunc(req,res);
});

module.exports = router;