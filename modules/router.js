const router = require('express').Router();

//attendee
const attendee = require('./attendee/attendee.router');
router.use('/attendee', attendee);

module.exports = router;
