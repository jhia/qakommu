'use strict'

const router = require('express').Router();
const activityController = require('./activity.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id?',function(req, res){
  //HTTP get route
  activityController.getFunc(req,res);
});

router.get('/:id_schedule/schedule/:id?',function(req, res){
  //HTTP get route
  activityController.getScheduleActivity(req,res);
});







router.post('/',(req, res) => {
  ///HTTP post route
  activityController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  activityController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  activityController.deleteFunc(req,res);
});

module.exports = router;
