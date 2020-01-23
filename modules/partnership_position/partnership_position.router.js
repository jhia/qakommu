'use strict'

const router = require('express').Router();
const partnership_positionController = require('./partnership_position.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  partnership_positionController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  partnership_positionController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  partnership_positionController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  partnership_positionController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  partnership_positionController.deleteFunc(req,res);
});

module.exports = router;