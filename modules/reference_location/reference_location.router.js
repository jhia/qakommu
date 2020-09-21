'use strict'

const router = require('express').Router();
const reference_locationController = require('./reference_location.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  reference_locationController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  reference_locationController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  reference_locationController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  reference_locationController.deleteFunc(req,res);
});

module.exports = router;