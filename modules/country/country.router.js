'use strict'

const router = require('express').Router();
const countryController = require('./country.controller');
const Response = require('../../http/response');

router.get('/',function(req, res){
  //HTTP get route
  countryController.getFunc(req, new Response(res));
});

router.get('/*', function(req, res) {
  res.status(404).end();
});


module.exports = router;