const router = require('express').Router();
const ticket_controller = require('../controllers/ticket.controller');
router.all('/:id?', (req, res) => {
  new ticket_controller(req, res);
});
module.exports = router;
