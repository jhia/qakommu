'use strict'

const router = require('express').Router();
const userController = require('./user.controller');
const Response = require('../../http/response');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

/* router.get('/',function(req, res){
  //HTTP get route
  userController.getFunc(req,res);
});
 */
router.get('/:id?',function(req, res){
  //HTTP get route
  userController.getFunc(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route: Add user
  userController.postFunc(req, new Response(res));
});

router.put('/:id?',(req, res) => {
  //HTTP put route
  userController.putFunc(req, new Response(res));
});

router.delete('/:id',(req, res) => {
  //HTTP delete route
  userController.deleteFunc(req, new Response(res));
});

module.exports = router;
