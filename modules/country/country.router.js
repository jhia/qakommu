'use strict'

const router = require('express').Router();
const countryController = require('./country.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  countryController.getFunc(req,res);
});


module.exports = router;