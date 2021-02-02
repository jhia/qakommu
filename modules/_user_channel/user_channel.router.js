'use strict'

const router = require('express').Router();
const user_channelController = require('./user_channel.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  user_channelController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  user_channelController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  user_channelController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  user_channelController.deleteFunc(req,res);
});

module.exports = router;