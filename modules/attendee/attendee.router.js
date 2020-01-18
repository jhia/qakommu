const router = require('express').Router();
const attendee_controller = require('./attendee.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module

});

router.get('/',(req, res) => {
  //HTTP get route
  attendee_controller.getFunc();
});

router.post('/',(req, res) => {
  ///HTTP post route
  attendee_controller.postFunc();
});

router.put('/',(req, res) => {
  //HTTP put route
  attendee_controller.putFunc();
});

router.delete('/',(req, res) => {
  //HTTP delete route
  attendee_controller.deleteFunc();
});

module.exports = router;
