'use strict'

const router = require('express').Router();
const likeController = require('./like.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id?',function(req, res){
  //HTTP get route
  likeController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  likeController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  likeController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  likeController.deleteFunc(req,res);
});

module.exports = router;
