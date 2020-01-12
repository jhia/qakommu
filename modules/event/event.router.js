const router = require('express').Router();
const event_controller = require('./event.controller');
router.all('/:id?', (req, res) => {
  new event_controller(req, res);
});
module.exports = router;
