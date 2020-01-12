const router = require('express').Router();
const sponsor_controller = require('../controllers/sponsor.controller');
router.all('/:id?', (req, res) => {
  new sponsor_controller(req, res);
});
module.exports = router;
