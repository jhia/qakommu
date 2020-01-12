const router = require('express').Router();
const ticket_sell_controller = require('../controllers/ticket_sell.controller');
router.all('/:id?', (req, res) => {
  new ticket_sell_controller(req, res);
});
module.exports = router;
