const router = require('express').Router();
const speaker_controller = require('./speaker.controller');
router.all('/:id?', (req, res) => {
  new speaker_controller(req, res);
});
module.exports = router;
