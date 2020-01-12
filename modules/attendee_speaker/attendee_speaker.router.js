const router = require('express').Router();
const attendee_speaker_controller = require('./attendee_speaker.controller');
router.all('/:id?', (req, res) => {
  new attendee_speaker_controller(req, res);
});
module.exports = router;
