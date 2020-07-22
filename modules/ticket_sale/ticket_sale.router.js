'use strict'

const router = require('express').Router();
const ticket_saleController = require('./ticket_sale.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  ticket_saleController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  ticket_saleController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
 // if(req.count < 1 || req.count == null ){
    //console.log(req);
 // }else{
    ticket_saleController.postFunc(req,res);
  //}
  
});

router.put('/:id',(req, res) => {
  //HTTP put route
  ticket_saleController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  ticket_saleController.deleteFunc(req,res);
});

module.exports = router;