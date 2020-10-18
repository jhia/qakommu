'use strict'

const router = require('express').Router();
const scheduleController = require('./schedule.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  scheduleController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  scheduleController.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  scheduleController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  scheduleController.deleteFunc(req,res);
});

module.exports = router;