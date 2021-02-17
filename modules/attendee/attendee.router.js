'use strict'

const router = require('express').Router();
const attendeeController = require('./attendee.controller');
const Response = require('../../http/response')
const { eventVerification } = require('../../middleware/event');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  attendeeController.getFunc(req, new Response(res));
});

router.get('/count/event/:eventId/', eventVerification, function(req, res){
  //HTTP get route
  attendeeController.getCountFromAttendees(req, new Response(res));
});




router.get('/:id',function(req, res){
  //HTTP get route
  attendeeController.getOne(req, new Response(res));
});
/*
router.get('/:id/sessions/all',function(req, res){
  //HTTP get route
  attendeeController.getSessionsByAttendee(req,res);
});
*/
router.post('/',(req, res) => {
  ///HTTP post route
  attendeeController.postFunc(req, new Response(res));
});

router.put('/:id',(req, res) => {
  //HTTP put route
  attendeeController.putFunc(req,new Response(res));
});

router.delete('/',(req, res) => {
  //HTTP delete route
  attendeeController.deleteFunc(req,new Response(res));
});


module.exports = router;