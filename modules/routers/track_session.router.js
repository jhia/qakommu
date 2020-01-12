const router = require('express').Router();
const track_session_controller = require('../controllers/track_session.controller');
router.all('/:id?', (req, res) => {
  new track_session_controller(req, res);
});
module.exports = router;
