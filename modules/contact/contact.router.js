const router = require('express').Router();
const contact_controller = require('./contact.controller');
router.all('/:id?', (req, res) => {
  new contact_controller(req, res);
});
module.exports = router;
