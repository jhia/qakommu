'use strict'

const router = require('express').Router();
const userController = require('./user.controller');

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
  userController.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  userController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
  //HTTP put route
  userController.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  userController.deleteFunc(req,res);
});

module.exports = router;