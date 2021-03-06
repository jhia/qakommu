'use strict'

const router = require('express').Router();
const channelController = require('./channel.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  channelController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  channelController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  channelController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  channelController.deleteFunc(req,res);
});

module.exports = router;