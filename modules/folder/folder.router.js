'use strict'

const router = require('express').Router();
const folderController = require('./folder.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:id',function(req, res){
  //HTTP get route
  folderController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  folderController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  folderController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  folderController.deleteFunc(req,res);
});

module.exports = router;
