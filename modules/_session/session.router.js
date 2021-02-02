'use strict'

const router = require('express').Router();
const sessionController = require('./session.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  sessionController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  sessionController.getFunc(req,res);
});

router.get('/:id_session/track/all',function(req, res){
  //HTTP get route
  sessionController.getTrackBySession(req,res);
});


router.post('/',(req, res) => {
  ///HTTP post route
  sessionController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  sessionController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  sessionController.deleteFunc(req,res);
});

module.exports = router;