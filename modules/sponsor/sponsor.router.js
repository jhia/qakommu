'use strict'

const router = require('express').Router();
const sponsorController = require('./sponsor.controller');
const Response = require('../../http/response')
const { eventVerification } = require('../../middleware/verification')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/event/:eventId', eventVerification, function(req, res){
  //HTTP get route
  sponsorController.getSponsorsByEvent(req, new Response(res));
});

router.get('/:id',function(req, res){
  //HTTP get route
  sponsorController.getOne(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route
  sponsorController.postFunc(req, new Response(res));
});

router.put('/:id',(req, res) => {
  //HTTP put route
  sponsorController.putFunc(req, new Response(res));
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  sponsorController.deleteFunc(req, new Response(res));
});

module.exports = router;