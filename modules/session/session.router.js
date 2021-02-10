'use strict'

const router = require('express').Router();
const sessionController = require('./session.controller');
const { eventVerification } = require('../../middleware/event');
const { Response } = require('../../http');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:eventId', eventVerification, function(req, res){
  //HTTP get route
  sessionController.getSessionsForEvent(req, new Response(res));
});

router.get('/:id', function(req, res){
  //HTTP get route
  sessionController.getOne(req, new Response(res));
});

router.get('/:id/track',function(req, res){
  //HTTP get route
  sessionController.getTracksForSession(req, new Response(res));
});


router.post('/',(req, res) => {
  ///HTTP post route
  sessionController.postFunc(req, new Response(res));
});

router.put('/:id', (req, res) => {
  //HTTP put route
  sessionController.putFunc(req, new Response(res));
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  sessionController.deleteFunc(req, new Response(res));
});

module.exports = router;