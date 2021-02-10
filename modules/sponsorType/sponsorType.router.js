'use strict'

const router = require('express').Router();
const controller = require('./sponsorType.controller');
const { communityCodeVerification } = require('../../middleware/community');
const Response = require('../../http/response')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/community/:communityCode', communityCodeVerification, function(req, res){
  //HTTP get route
  controller.getTypesByCommunity(req, new Response(res));
});


router.get('/community/:communityCode/count', communityCodeVerification, function(req, res){
  //HTTP get route
  controller.getCountTypesByCommunity(req, new Response(res));
});

router.get('/:id', function(req, res){
  //HTTP get route
  controller.getOne(req, new Response(res));
});


router.post('/',(req, res) => {
  ///HTTP post route
  controller.postFunc(req, new Response(res));
});

router.put('/:id',(req, res) => {
  //HTTP put route
  controller.putFunc(req, new Response(res));
});


router.delete('/multiple',(req, res) => {
  //HTTP delete route
  controller.deleteMultiple(req, new Response(res));
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  controller.deleteFunc(req, new Response(res));
});






module.exports = router;