'use strict'

const router = require('express').Router();
const speakerController = require('./speaker.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  speakerController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  speakerController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  speakerController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  speakerController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  speakerController.deleteFunc(req,res);
});

module.exports = router;