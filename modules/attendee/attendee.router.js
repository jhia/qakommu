const router = require('express').Router();
const attendee_controller = require('./attendee.controller');
router.all('/:id?', (req, res) => {
  new attendee_controller(req, res);
});
module.exports = router;
