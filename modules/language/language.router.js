'use strict'

const router = require('express').Router();
const languageController = require('./language.controller');


router.get('/',function(req, res){
  //HTTP get all languages
  languageController.getFunc(req,res);
});

router.get('/*', function(req, res) {
  res.status(404).end();
})


module.exports = router;