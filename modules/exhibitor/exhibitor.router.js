'use strict'

const router = require('express').Router();
const exhibitorController = require('./exhibitor.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  exhibitorController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  exhibitorController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  exhibitorController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  exhibitorController.deleteFunc(req,res);
});

module.exports = router;