'use strict'

const router = require('express').Router();
const module_nameController = require('./module_name.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  module_nameController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  module_nameController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  module_nameController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  module_nameController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  module_nameController.deleteFunc(req,res);
});

module.exports = router;