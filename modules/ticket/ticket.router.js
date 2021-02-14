'use strict'

const router = require('express').Router();
const ticketController = require('./ticket.controller');
const Response = require('../../http/response');
const { eventVerification } = require('../../middleware/event')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/event/:eventId', eventVerification, function(req, res){
  //HTTP get route
  ticketController.getFunc(req, new Response(res));
});

router.get('/:ticketId', function(req, res){
  //HTTP get route
  ticketController.getFunc(req, new Response(res));
});

router.post('/event/:eventId', eventVerification, (req, res) => {
  ///HTTP post route
  ticketController.postFunc(req, new Response(res));
});

router.put('/:ticketId', (req, res) => {
  //HTTP put route
  ticketController.putFunc(req, new Response(res));
});

router.delete('/:ticketId',(req, res) => {
  //HTTP delete route
  ticketController.deleteFunc(req, new Response(res));
});

module.exports = router;