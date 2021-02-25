'use strict'

const router = require('express').Router();
const trackController = require('./track.controller');
const { communityCodeVerification, eventVerification } = require('../../middleware/verification')
const Response = require('../../http/response');

router.get('/community/:communityCode', communityCodeVerification, (req, res) => {
  //HTTP get route
  trackController.getTracksForCommunity(req, new Response(res));
});

router.get('/event/:eventId', eventVerification, (req, res) => {
  trackController.getTracksForEvent(req, new Response(res));
})

router.get('/:id', (req, res) => {
  //HTTP get route
  trackController.getOne(req, new Response(res));
});

router.post('/', (req, res) => {
  ///HTTP post route
  trackController.postFunc(req, new Response(res));
});

router.put('/:id', (req, res) => {
  //HTTP put route
  trackController.putFunc(req, new Response(res));
});

router.delete('/:id', (req, res) => {
  //HTTP delete route
  trackController.deleteFunc(req, new Response(res));
});

module.exports = router;