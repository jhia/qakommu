'use strict'

const router = require('express').Router();
const postController = require('./post.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  postController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  postController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  postController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  postController.deleteFunc(req,res);
});

module.exports = router;