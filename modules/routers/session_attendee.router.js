const router = require('express').Router();
const session_attendee_controller = require('../controllers/session_attendee.controller');
router.all('/:id?', (req, res) => {
  new session_attendee_controller(req, res);
});
module.exports = router;
