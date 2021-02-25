'use strict'

const router = require('express').Router();
const controller = require('./sessionAttendee.controller');
const Response = require('../../http/response');

const {
  attendeeVerification,
  sessionAttendeeVerification,
  sessionVerification
} = require('../../middleware/verification')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/session/:sessionId', sessionVerification, function(req, res){
  //HTTP get route
  controller.getAllBySession(req, new Response(res));
});

router.get('/attendee/:attendeeId', attendeeVerification, function(req, res){
  //HTTP get route
  controller.getAllByAttendee(req, new Response(res));
});

router.get('/:sessionAttendeeId', sessionAttendeeVerification, (req, res) => {
  //HTTP get route
  controller.getOneSessionAttendee(req, new Response(res));
})


router.post('/session/:sessionId', sessionVerification, (req, res) => {
  ///HTTP post route
  controller.postFunc(req, new Response(res));
});

router.put('/:sessionAttendeeId', sessionAttendeeVerification, (req, res) => {
  //HTTP put route
  controller.putFunc(req, new Response(res));
});

router.delete('/:sessionAttendeeId', sessionAttendeeVerification, (req, res) => {
  //HTTP delete route
  controller.deleteFunc(req, new Response(res));
});

module.exports = router;