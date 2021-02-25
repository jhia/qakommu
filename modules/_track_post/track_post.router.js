'use strict'

const router = require('express').Router();
const track_postController = require('./track_post.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  track_postController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  track_postController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  track_postController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  track_postController.deleteFunc(req,res);
});

module.exports = router;