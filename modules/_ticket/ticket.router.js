'use strict'

const router = require('express').Router();
const ticketController = require('./ticket.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  ticketController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  ticketController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  ticketController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  ticketController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  ticketController.deleteFunc(req,res);
});

module.exports = router;