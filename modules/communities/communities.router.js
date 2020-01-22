'use strict'

const router = require('express').Router();
const communitiesController = require('./communities.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  communitiesController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  communitiesController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  communitiesController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  communitiesController.deleteFunc(req,res);
});

module.exports = router;