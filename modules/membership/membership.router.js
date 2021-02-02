'use strict'

const router = require('express').Router();
const membershipController = require('./membership.controller');
const Response = require('../../http/response');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  membershipController.getFunc(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route
  membershipController.postFunc(req, new Response(res));
});

router.put('/',(req, res) => {
  //HTTP put route
  membershipController.putFunc(req, new Response(res));
});

router.delete('/',(req, res) => {
  //HTTP delete route
  membershipController.deleteFunc(req, new Response(res));
});

module.exports = router;