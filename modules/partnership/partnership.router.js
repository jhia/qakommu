'use strict'

const router = require('express').Router();
const partnershipController = require('./partnership.controller');
const Response = require('../../http/response');
const { communityCodeVerification } = require('../../middleware/verification');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/', function (req, res) {
  //HTTP get route
  partnershipController.getFunc(req, new Response(res));
});

router.get('/:id', function (req, res) {
  //HTTP get route
  partnershipController.getOne(req, new Response(res));
});


router.get('/community/:communityCode', communityCodeVerification, function (req, res) {
  //HTTP get route
  partnershipController.getPartnershipByCommunity(req, new Response(res));
});



router.post('/', (req, res) => {
  ///HTTP post route
  partnershipController.postFunc(req, new Response(res));
});

router.put('/:id', (req, res) => {
  //HTTP put route
  partnershipController.putFunc(req, new Response(res));
});

router.delete('/:id', (req, res) => {
  //HTTP delete route
  partnershipController.deleteFunc(req, new Response(res));
});

module.exports = router;