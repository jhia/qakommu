'use strict'

const router = require('express').Router();
const countryController = require('./country.controller');

router.get('/',function(req, res){
  //HTTP get route
  countryController.getFunc(req,res);
});

router.get('/*', function(req, res) {
  res.status(404).end();
});


module.exports = router;