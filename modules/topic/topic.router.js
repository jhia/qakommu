'use strict'

const router = require('express').Router();
const topicController = require('./topic.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});



router.get('/:id?/forum/:id_forum',function(req, res){
  //HTTP get route
  topicController.getForumTopic(req,res);
});









router.get('/:id?',function(req, res){
  //HTTP get route
  topicController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  topicController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  topicController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  topicController.deleteFunc(req,res);
});

module.exports = router;
