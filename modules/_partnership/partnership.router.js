'use strict'

const router = require('express').Router();
const partnershipController = require('./partnership.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  partnershipController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  partnershipController.getFunc(req,res);
});


router.get('/community/:id_community',function(req, res){
  //HTTP get route
  partnershipController.getPartnershiptByCommunity(req,res);
});



router.post('/',(req, res) => {
  ///HTTP post route
  partnershipController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  partnershipController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  partnershipController.deleteFunc(req,res);
});

module.exports = router;