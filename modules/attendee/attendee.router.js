'use strict'

const router = require('express').Router();
const attendeeController = require('./attendee.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  attendeeController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  attendeeController.getFunc(req,res);
});

router.get('/:id/sessions/all',function(req, res){
  //HTTP get route
  attendeeController.getSessionsByAttendee(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  attendeeController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  attendeeController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  attendeeController.deleteFunc(req,res);
});

module.exports = router;