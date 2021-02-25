'use strict'

const router = require('express').Router();
const forumController = require('./forum.controller');

router.use((req, res, next) => {
    //Use this to apply a middleware only to this module
    next();
});

router.get('/:id?',function(req, res){
    //HTTP get route
    forumController.getFunc(req,res);
});

router.post('/',(req, res) => {
    ///HTTP post route
    forumController.postFunc(req,res);
});

router.put('/:id',(req, res) => {
    //HTTP put route
    forumController.putFunc(req,res);
});

router.delete('/:id',(req, res) => {
    //HTTP delete route
    forumController.deleteFunc(req,res);
});

module.exports = router;
