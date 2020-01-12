const router = require('express').Router();
const event_controller = require('../controllers/event.controller');
router.all('/:id?', (req, res) => {
  new event_controller(req, res);
});
module.exports = router;
