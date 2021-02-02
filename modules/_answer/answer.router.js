'use strict'

const router = require('express').Router();
const answerController = require('./answer.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  answerController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  answerController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  answerController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  answerController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  answerController.deleteFunc(req,res);
});

module.exports = router;