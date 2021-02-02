'use strict'

const router = require('express').Router();
const type_boothController = require('./type_booth.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  type_boothController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  type_boothController.getFunc(req,res);
});

router.get('/community/:id_community',function(req, res){
  //HTTP get route
  type_boothController.getTypeBoothByCommunity(req,res);
});

router.get('/community/:id_community/count',function(req, res){
  //HTTP get route
  type_boothController.getCountTypeBoothByCommunity(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  type_boothController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  type_boothController.putFunc(req,res);
});


router.delete('/multiple',(req, res) => {
  //HTTP delete route
  type_boothController.deleteMultiple(req,res);
});


router.delete('/:id',(req, res) => {
  //HTTP delete route
  type_boothController.deleteFunc(req,res);
});

module.exports = router;