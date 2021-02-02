'use strict'

const router = require('express').Router();
const questionController = require('./question.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  questionController.getFunc(req,res);
});


router.get('/:id',function(req, res){
  //HTTP get route
  questionController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  questionController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  questionController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  questionController.deleteFunc(req,res);
});

module.exports = router;