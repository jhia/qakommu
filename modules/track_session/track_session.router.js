'use strict'

const router = require('express').Router();
const track_sessionController = require('./track_session.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  track_sessionController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  track_sessionController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  track_sessionController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  track_sessionController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  track_sessionController.deleteFunc(req,res);
});

module.exports = router;