'use strict'

const router = require('express').Router();
const type_sponsorController = require('./type_sponsor.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  type_sponsorController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  type_sponsorController.getFunc(req,res);
});

router.get('/community/:id_community',function(req, res){
  //HTTP get route
  type_sponsorController.getTypeSponsorByCommunity(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  type_sponsorController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  type_sponsorController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  type_sponsorController.deleteFunc(req,res);
});

module.exports = router;