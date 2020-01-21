'use strict'

const router = require('express').Router();
const stateController = require('./state.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  res.status('200').send(stateController.getFunc());
});

router.post('/',(req, res) => {
  ///HTTP post route
  stateController.postFunc(req, res);
});


router.put('/',(req, res) => {
  //HTTP put route
  res.status('200').send(stateController.putFunc());
});

router.delete('/',(req, res) => {
  //HTTP delete route
  res.status('200').send(stateController.deleteFunc());
});

module.exports = router;