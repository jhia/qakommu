const router = require('express').Router();
const contact_detail_controller = require('../controllers/contact_detail.controller');
router.all('/:id?', (req, res) => {
  new contact_detail_controller(req, res);
});
module.exports = router;
