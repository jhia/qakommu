const router = require('express').Router();
const contact_position_controller = require('./contact_position.controller');
router.all('/:id?', (req, res) => {
  new contact_position_controller(req, res);
});
module.exports = router;
