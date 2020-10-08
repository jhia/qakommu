'use strict'

const router = require('express').Router();
const couponController = require('./coupon.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  couponController.getFunc(req,res);
});

router.get('/:id',function(req, res){
  //HTTP get route
  couponController.getFunc(req,res);
});

router.get('/:id_coupon/ticket_sale/all',function(req, res){
  //HTTP get route
  couponController.ticketSaleByCoupon(req,res);
});

router.get('/calculator/:p/:d',function(req, res){
  //HTTP get route
  couponController.couponCalculator(req,res);
});

router.get('/range/:since/:until',function(req, res){
  //HTTP get route
  couponController.couponbetweenDate(req,res);
});


router.post('/',(req, res) => {
  ///HTTP post route
  couponController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  couponController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  couponController.deleteFunc(req,res);
});

module.exports = router;