'use strict'

const router = require('express').Router();
const roomController = require('./room.controller');
const { eventVerification } = require('../../middleware/event');
const { roomVerification } = require('../../middleware/room');
const Response = require('../../http/response');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/event/:eventId', eventVerification, function(req, res){
  //HTTP get route
  roomController.getRoomsByEvent(req, new Response(res));
});

router.get('/:roomId', roomVerification, function(req, res){
  //HTTP get route
  roomController.getOne(req, new Response(res));
});

router.post('/event/:eventId', eventVerification, (req, res) => {
  ///HTTP post route
  roomController.postFunc(req, new Response(res));
});

router.put('/:roomId', roomVerification, (req, res) => {
  //HTTP put route
  roomController.putFunc(req, new Response(res));
});

router.delete('/:roomId', roomVerification, (req, res) => {
  //HTTP delete route
  roomController.deleteFunc(req, new Response(res));
});

module.exports = router;