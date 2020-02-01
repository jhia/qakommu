'use strict'

const router = require('express').Router();
const roleController = require('./role.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id?',function(req, res){
  //HTTP get route
  roleController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  roleController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  roleController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  roleController.deleteFunc(req,res);
});

module.exports = router;