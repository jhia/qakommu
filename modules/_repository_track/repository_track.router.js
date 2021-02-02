'use strict'

const router = require('express').Router();
const repository_trackController = require('./repository_track.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  repository_trackController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  repository_trackController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  repository_trackController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  repository_trackController.deleteFunc(req,res);
});

module.exports = router;