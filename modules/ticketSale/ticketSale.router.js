'use strict'

const router = require('express').Router();
const controller = require('./ticketSale.controller');
const Response = require('../../http/response');
const { ticketVerification, ticketSaleVerification } = require('../../middleware/ticket')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});


router.get('/ticket/:ticketId', ticketVerification, function(req, res){
  //HTTP get route
  controller.getTicketSaleByTicket(req, new Response(res));
});

router.get('/:ticketSaleId', ticketSaleVerification, function(req, res){
  //HTTP get route
  controller.getOne(req, new Response(res));
});


router.post('/ticket/:ticketId', ticketVerification, (req, res) => {
  ///HTTP post route
 // if(req.count < 1 || req.count == null ){
    //console.log(req);
 // }else{
    controller.postFunc(req, new Response(res));
  //}
  
});

router.put('/:ticketSaleId', ticketSaleVerification, (req, res) => {
  //HTTP put route
  controller.putFunc(req, new Response(res));
});

router.delete('/:ticketSaleId', ticketSaleVerification, (req, res) => {
  //HTTP delete route
  controller.deleteFunc(req, new Response(res));
});

module.exports = router;