'use strict'

const router = require('express').Router();
const communityController = require('./community.controller');
const Response = require('../../http/response');

const { communityOwner } = require('../../middleware/community')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/', (req, res) => {
  communityController.getMyCommunities(req, new Response(res));
})

router.get('/search', (req, res) => {
  communityController.getPublicCommunities(req, new Response(res));
})

router.get('/:id', (req, res) => {
  communityController.getOne(req, new Response(res));
})

router.post('/',(req, res) => {
  ///HTTP post route
  communityController.postFunc(req, new Response(res));
});

router.put('/:id', communityOwner, (req, res) => {
  //HTTP put route
  communityController.putFunc(req, new Response(res));
});

router.delete('/:id', communityOwner, (req, res) => {
  //HTTP delete route
  communityController.deleteFunc(req, new Response(res));
});

module.exports = router;