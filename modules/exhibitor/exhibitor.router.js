'use strict'

const router = require('express').Router();
const exhibitorController = require('./exhibitor.controller');
const Response = require('../../http/response')
const { eventVerification, exhibitorVerification } = require('../../middleware/verification');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/event/:eventId', eventVerification, function(req, res){
  //HTTP get route
  exhibitorController.getExhibitorByEvent(req, new Response(res));
});

router.get('/:exhibitorId', exhibitorVerification, function (req, res) {
  //HTTP get route
  exhibitorController.getOne(req, new Response(res));
});

router.post('/event/:eventId', eventVerification, function (req, res) {
  ///HTTP post route
  exhibitorController.postFunc(req, new Response(res));
});

router.put('/:exhibitorId', exhibitorVerification, function (req, res) {
  //HTTP put route
  exhibitorController.putFunc(req, new Response(res));
});

router.delete('/:exhibitorId', exhibitorVerification, function(req, res) {
  //HTTP delete route
  exhibitorController.deleteFunc(req, new Response(res));
});

module.exports = router;