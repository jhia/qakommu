'use strict'

const router = require('express').Router();
const commentController = require('./comment.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id',function(req, res){
  //HTTP get route
  commentController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  commentController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  commentController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  commentController.deleteFunc(req,res);
});

module.exports = router;