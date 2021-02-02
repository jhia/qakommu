'use strict'

const router = require('express').Router();
const messageController = require('./message.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id?',function(req, res){
  //HTTP get route
  if (req.params) {
    messageController.getMessageByChannel(req,res);
  }else{
    messageController.getFunc(req,res);    
  }
});

router.post('/',(req, res) => {
  ///HTTP post route
  messageController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  messageController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  messageController.deleteFunc(req,res);
});

module.exports = router;