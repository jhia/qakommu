'use strict'

const router = require('express').Router();
const permissionController = require('./permission.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id?',function(req, res){
  //HTTP get route
  permissionController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  permissionController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  permissionController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  permissionController.deleteFunc(req,res);
});

module.exports = router;