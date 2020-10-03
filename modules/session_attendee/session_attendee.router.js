'use strict'

const router = require('express').Router();
const session_attendeeController = require('./session_attendee.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  session_attendeeController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  session_attendeeController.getFunc(req,res);
});


router.post('/',(req, res) => {
  ///HTTP post route
  session_attendeeController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  session_attendeeController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  session_attendeeController.deleteFunc(req,res);
});

module.exports = router;