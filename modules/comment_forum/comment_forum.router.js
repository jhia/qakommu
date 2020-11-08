'use strict'

const router = require('express').Router();
const comment_forumController = require('./comment_forum.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  comment_forumController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  comment_forumController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  comment_forumController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  comment_forumController.deleteFunc(req,res);
});

module.exports = router;