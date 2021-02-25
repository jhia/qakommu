'use strict'

const router = require('express').Router();
const controller = require('./boothType.controller');
const Response = require('../../http/response');
const { communityCodeVerification, boothTypeVerification } = require('../../middleware/verification');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/community/:communityCode', communityCodeVerification, function (req, res) {
  controller.getTypesFromCommunity(req, new Response(res));
})

router.get('/community/:communityCode/count', communityCodeVerification, function (req, res) {
  controller.getCountTypesFromCommunity(req, new Response(res));
})

router.get('/:boothTypeId', boothTypeVerification, function(req, res){
  //HTTP get route
  controller.getOne(req, new Response(res));
});

router.post('/community/:communityCode', communityCodeVerification, (req, res) => {
  ///HTTP post route
  controller.postFunc(req, new Response(res));
});

router.put('/:boothTypeId', boothTypeVerification, (req, res) => {
  //HTTP put route
  controller.putFunc(req, new Response(res));
});


router.delete('/', (req, res) => {
  //HTTP delete route
  controller.deleteMultiple(req, new Response(res));
});

module.exports = router;