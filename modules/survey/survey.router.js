'use strict'

const router = require('express').Router();
const surveyController = require('./survey.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  surveyController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  surveyController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  surveyController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  surveyController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  surveyController.deleteFunc(req,res);
});

module.exports = router;