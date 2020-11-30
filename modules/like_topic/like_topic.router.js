'use strict'

const router = require('express').Router();
const like_topicController = require('./like_topic.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  like_topicController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  like_topicController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  like_topicController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  like_topicController.deleteFunc(req,res);
});

module.exports = router;