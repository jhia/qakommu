'use strict'

const router = require('express').Router();
const exhibitorController = require('./exhibitor.controller');
const { eventVerification } = require('../../middleware/verification');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/event/:eventId', eventVerification, function(req, res){
  //HTTP get route
  exhibitorController.getExhibitorByEvent(req, new Response(res));
});

router.get('/:id', (req, res) => {
  //HTTP get route
  exhibitorController.getOne(req, new Response(res));
});

router.post('/', (req, res) => {
  ///HTTP post route
  exhibitorController.postFunc(req, new Response(res));
});

router.put('/:id', (req, res) => {
  //HTTP put route
  exhibitorController.putFunc(req, new Response(res));
});

router.delete('/:id', (req, res) => {
  //HTTP delete route
  exhibitorController.deleteFunc(req, new Response(res));
});

module.exports = router;