const router = require('express').Router();
const input_controller = require('../controllers/input.controller');
router.all('/:id?', (req, res) => {
  new input_controller(req, res);
});
module.exports = router;
