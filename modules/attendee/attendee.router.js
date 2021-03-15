'use strict'

const router = require('express').Router();
const attendeeController = require('./attendee.controller');
const Response = require('../../http/response')
const {
  attendeeVerification,
  eventVerification,
  ticketSaleDetailUUIDVerification
} = require('../../middleware/verification');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/event/:eventId', eventVerification, function(req, res){
  //HTTP get route
  attendeeController.getFunc(req, new Response(res));
});

router.get('/event/:eventId/count', eventVerification, function(req, res){
  //HTTP get route
  attendeeController.getCountFromAttendees(req, new Response(res));
});

router.get('/event/:eventId/ticket/:ticketSaleDetailUUID/verification/', ticketSaleDetailUUIDVerification, function(req, res) {
  attendeeController.getVerificationUUID(req, new Response(res));
})

router.get('/ticket/:ticketSaleDetailUUID', ticketSaleDetailUUIDVerification, function(req, res) {
  attendeeController.getOneFromTicket(req, new Response(res));
})

router.get('/:attendeeId', attendeeVerification, function(req, res){
  //HTTP get route
  attendeeController.getOne(req, new Response(res));
});

// create from event
router.post('/event/:eventId', eventVerification, (req, res) => {
  ///HTTP post route
  attendeeController.postFunc(req, new Response(res));
});

// create attendee from ticket
router.post('/ticket/:ticketSaleDetailUUID', ticketSaleDetailUUIDVerification, function(req, res) {
  attendeeController.postFromTicket(req, new Response(res));
})

router.put('/:attendeeId', attendeeVerification, (req, res) => {
  //HTTP put route
  attendeeController.putFunc(req,new Response(res));
});

router.delete('/',(req, res) => {
  //HTTP delete route
  attendeeController.deleteFunc(req,new Response(res));
});


module.exports = router;