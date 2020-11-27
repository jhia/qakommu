'use strict'

const router = require('express').Router();
const like-forumController = require('./like-forum.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  like-forumController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  like-forumController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  like-forumController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  like-forumController.deleteFunc(req,res);
});

module.exports = router;