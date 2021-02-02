'use strict'

const router = require('express').Router();
const communityController = require('./community.controller');
const Response = require('../../http/response');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id?/:time?',function(req, res){
  //HTTP get route
  communityController.getFunc(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route
  communityController.postFunc(req, new Response(res));
});

router.put('/:id',(req, res) => {
  //HTTP put route
  communityController.putFunc(req, new Response(res));
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  communityController.deleteFunc(req, new Response(res));
});

module.exports = router;