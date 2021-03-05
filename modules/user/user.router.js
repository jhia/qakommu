'use strict'

const router = require('express').Router();
const userController = require('./user.controller');
const Response = require('../../http/response');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  userController.getMyUser(req, new Response(res));
});

router.get('/:username',function(req, res){
  //HTTP get route
  userController.getOne(req, new Response(res));
});



router.get('/email/:email',function(req, res){
  //HTTP get route
  userController.getOneByEmail(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route: Add user
  userController.postFunc(req, new Response(res));
});

router.put('/',(req, res) => {
  //HTTP put route
  userController.putFunc(req, new Response(res));
});

router.put('/credentials', (req, res) => {
  userController.updatePassword(req, new Response(res));
})

router.delete('/',(req, res) => {
  //HTTP delete route
  userController.deleteFunc(req, new Response(res));
});

module.exports = router;
