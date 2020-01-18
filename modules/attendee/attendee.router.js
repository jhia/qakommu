const router = require('express').Router();
const attendee_controller = require('./attendee.controller');

/*router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});*/

router.get('/',function(req, res){
  //HTTP get route
  res.status('200').send(attendee_controller.getFunc());
});

router.post('/',(req, res) => {
  ///HTTP post route
  res.status('200').send(attendee_controller.postFunc());
});

router.put('/',(req, res) => {
  //HTTP put route
  res.status('200').send(attendee_controller.putFunc());
});

router.delete('/',(req, res) => {
  //HTTP delete route
  res.status('200').send(attendee_controller.deleteFunc());
});

module.exports = router;
