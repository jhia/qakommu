'use strict'

const router = require('express').Router();
const image_postController = require('./image_post.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  image_postController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  image_postController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  image_postController.putFunc(req,res);
});

router.delete('/:image',(req, res) => {
  //HTTP delete route
  image_postController.deleteFunc(req,res);
});

module.exports = router;
