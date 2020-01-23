'use strict'

const router = require('express').Router();
const eventController = require('./event.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  eventController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  eventController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  eventController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  eventController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  eventController.deleteFunc(req,res);
});

module.exports = router;