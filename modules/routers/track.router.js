const router = require('express').Router();
const track_controller = require('../controllers/track.controller');
router.all('/:id?', (req, res) => {
  new track_controller(req, res);
});
module.exports = router;
