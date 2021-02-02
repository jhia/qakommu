'use strict'

const router = require('express').Router();
const eventController = require('./event.controller');
const Response = require('../../http/response')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  eventController.getFunc(req, new Response(res));
});

router.get('/:id',function(req, res){
  //HTTP get route
  eventController.getOne(req, new Response(res));
});

router.get('/community/:id_community/all/',function(req, res){
  //HTTP get route
  eventController.getEventsByCommunity(req, new Response(res));
});


router.get('/community/:id_community/public/',function(req, res){
  //HTTP get route
  eventController.getPublicEventsByCommunity(req, new Response(res));
});


router.get('/:id_event/speaker/all/',function(req, res){
  //HTTP get route
  eventController.getSpeakersByEvent(req, new Response(res));
});

router.get('/:id_event/ticket/all/',function(req, res){
  //HTTP get route
  eventController.getTicketsByEvent(req, new Response(res));
});

router.get('/:id_event/attendee/all/',function(req, res){
  //HTTP get route
  eventController.getAttendeesByEvent(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route
  eventController.postFunc(req, new Response(res));
});

router.put('/:id',(req, res) => {
  //HTTP put route
  eventController.putFunc(req, new Response(res));
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  eventController.deleteFunc(req, new Response(res));
});

module.exports = router;