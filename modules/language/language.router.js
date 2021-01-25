'use strict'

const router = require('express').Router();
const languageController = require('./language.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get all languages
  languageController.getFunc(req,res);
});


module.exports = router;