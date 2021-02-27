'use strict'

const router = require('express').Router();
const formController = require('./form.controller');
const Response = require('../../http/response')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/:formId', function(req, res){
  //HTTP get route
  formController.getFunc(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route
  formController.postFunc(req, new Response(res));
});

router.put('/',(req, res) => {
  //HTTP put route
  formController.putFunc(req, new Response(res));
});

router.delete('/',(req, res) => {
  //HTTP delete route
  formController.deleteFunc(req, new Response(res));
});

module.exports = router;