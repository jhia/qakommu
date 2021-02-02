'use strict'

const router = require('express').Router();
const roomController = require('./room.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  roomController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  roomController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  roomController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  roomController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  roomController.deleteFunc(req,res);
});

module.exports = router;