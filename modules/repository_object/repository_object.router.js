'use strict'

const router = require('express').Router();
const repository_objectController = require('./repository_object.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  repository_objectController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  repository_objectController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  repository_objectController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  repository_objectController.deleteFunc(req,res);
});

module.exports = router;