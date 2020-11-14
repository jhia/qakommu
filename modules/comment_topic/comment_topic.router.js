'use strict'

const router = require('express').Router();
const comment_topicController = require('./comment_topic.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id?/topic/:id_topic',function(req, res){
  //HTTP get route
  comment_topicController.getCommentTopic(req,res);
});

router.get('/:id?',function(req, res){
  //HTTP get route
  comment_topicController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  comment_topicController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  comment_topicController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  comment_topicController.deleteFunc(req,res);
});

module.exports = router;
