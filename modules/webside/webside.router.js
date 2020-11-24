'use strict'

const router = require('express').Router();
const websideController = require('./webside.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id',function(req, res){
  //HTTP get route
  websideController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  websideController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  websideController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  websideController.deleteFunc(req,res);
});

module.exports = router;