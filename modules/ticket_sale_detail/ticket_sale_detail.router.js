'use strict'

const router = require('express').Router();
const ticket_sale_detailController = require('./ticket_sale_detail.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  ticket_sale_detailController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  ticket_sale_detailController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  ticket_sale_detailController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  ticket_sale_detailController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  ticket_sale_detailController.deleteFunc(req,res);
});

module.exports = router;