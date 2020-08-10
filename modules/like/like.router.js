'use strict'

const router = require('express').Router();
const likeController = require('./like.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  likeController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  likeController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  likeController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  likeController.deleteFunc(req,res);
});

module.exports = router;