'use strict'

const router = require('express').Router();
const trackController = require('./track.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  trackController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  trackController.getFunc(req,res);
});

router.get('/community/:id_community',function(req, res){
  //HTTP get route
  trackController.getTrackByCommunity(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  trackController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  trackController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  trackController.deleteFunc(req,res);
});

module.exports = router;