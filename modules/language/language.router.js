'use strict'

const router = require('express').Router();
const languageController = require('./language.controller');
const Response = require('../../http/response')


router.get('/',function(req, res){
  //HTTP get all languages
  languageController.getFunc(req, new Response(res));
});

router.get('/*', function(req, res) {
  res.status(404).end();
})


module.exports = router;