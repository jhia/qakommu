'use strict'

const router = require('express').Router();
const eventController = require('./event.controller');
const Response = require('../../http/response');
const { eventVerification } = require('../../middleware/event');
const { communityCodeVerification, communityOwner } = require('../../middleware/community');
router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  eventController.getFunc(req, new Response(res));
});

router.get('/:eventId', eventVerification, function(req, res){
  //HTTP get route
  eventController.getOne(req, new Response(res));
});

router.get('/community/:communityCode/', communityCodeVerification, function(req, res){
  //HTTP get route
  eventController.getEventsByCommunity(req, new Response(res));
});

/*
router.get('/community/:communityCode/public/',function(req, res){
  //HTTP get route
  eventController.getPublicEventsByCommunity(req, new Response(res));
});*/

router.post('/community/:communityCode', communityCodeVerification, communityOwner, (req, res) => {
  ///HTTP post route
  eventController.postFunc(req, new Response(res));
});

router.put('/:eventId', eventVerification, (req, res) => {
  //HTTP put route
  eventController.putFunc(req, new Response(res));
});

router.delete('/:eventId', eventVerification, (req, res) => {
  //HTTP delete route
  eventController.deleteFunc(req, new Response(res));
});

module.exports = router;