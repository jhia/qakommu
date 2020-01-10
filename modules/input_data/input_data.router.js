const router = require('express').Router();
const input_data_controller = require('./input_data.controller');
router.all('/:id?', (req, res) => {
  new input_data_controller(req, res);
});
module.exports = router;
