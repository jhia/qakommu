'use strict'

const router = require('express').Router();
const user_typeController = require('./user_type.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  user_typeController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  user_typeController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  user_typeController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  user_typeController.deleteFunc(req,res);
});

module.exports = router;