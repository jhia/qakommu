'use strict'

const router = require('express').Router();
const sponsorController = require('./sponsor.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  sponsorController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  sponsorController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  sponsorController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  sponsorController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  sponsorController.deleteFunc(req,res);
});

module.exports = router;